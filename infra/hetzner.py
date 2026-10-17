#!/usr/bin/env python3
"""Outil du projet 1 pour piloter Hetzner Cloud depuis GitHub Actions (ou un terminal).

Commandes :
  ip         affiche l'adresse IPv4 du serveur (code de sortie 3 s'il n'existe pas) ;
             si la variable SERVEUR_IP est définie (serveur hors Hetzner), l'affiche directement
  cloud-init affiche la configuration cloud-init (comptes, Docker, swap) à coller dans un
             autre hébergeur, par exemple le champ « Custom data » d'une VM Azure
  creer      crée le pare-feu, la clé SSH et le serveur (avec cloud-init)
  supprimer  supprime le serveur (--tous : tous les serveurs du projet Hetzner)
  budget     garde-budget : calcule la consommation, détecte les changements,
             écrit un rapport et décide s'il faut alerter ou arrêter

Variables d'environnement :
  HCLOUD_TOKEN    jeton API Hetzner (lecture et écriture)          obligatoire avec Hetzner
  SERVEUR_IP      adresse d'un serveur hors Hetzner (ex. Azure)    facultatif
  SERVEUR_NOM     nom du serveur                                   défaut : projet1
  TYPE_SERVEUR    type de serveur                                  défaut : cpx22
  EMPLACEMENT     site Hetzner (nbg1, hel1, fsn1)                  défaut : nbg1
  BUDGET          budget total, dans la devise du compte Hetzner   défaut : 25
  ALERTE          seuil d'alerte (fraction du budget)              défaut : 0.75
  ARRET           seuil d'arrêt automatique (fraction du budget)   défaut : 0.95
  RAPPORT_HEURE   heure UTC du rapport quotidien                   défaut : 18
  RESPONSABLE     identifiant GitHub à mentionner dans les alertes (facultatif)

Aucune dépendance : uniquement la bibliothèque standard de Python 3.
"""
import argparse
import datetime as dt
import json
import math
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

API = "https://api.hetzner.cloud/v1"
NOM = os.environ.get("SERVEUR_NOM", "projet1")
TYPE = os.environ.get("TYPE_SERVEUR", "cpx22")
LIEU = os.environ.get("EMPLACEMENT", "nbg1")
NOM_PAREFEU = f"fw-{NOM}"
NOM_CLE = f"{NOM}-deploy"
NOM_IP = f"{NOM}-ipv4"   # adresse conservée entre deux créations (même URL)


def env_float(nom, defaut):
    valeur = os.environ.get(nom, "").strip()
    return float(valeur) if valeur else defaut


# ---------------------------------------------------------------------------
# Accès à l'API
# ---------------------------------------------------------------------------
def api(methode, chemin, corps=None):
    jeton = os.environ.get("HCLOUD_TOKEN")
    if not jeton:
        sys.exit("HCLOUD_TOKEN manquant (secret GitHub non défini ?)")
    donnees = json.dumps(corps).encode() if corps is not None else None
    req = urllib.request.Request(API + chemin, data=donnees, method=methode)
    req.add_header("Authorization", f"Bearer {jeton}")
    req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req, timeout=60) as rep:
            brut = rep.read()
            return json.loads(brut) if brut else {}
    except urllib.error.HTTPError as err:
        detail = err.read().decode(errors="replace")
        sys.exit(f"Erreur API Hetzner {err.code} sur {methode} {chemin} : {detail}")


def lister(chemin, cle):
    """Toutes les pages d'une liste de l'API."""
    resultats, page = [], 1
    sep = "&" if "?" in chemin else "?"
    while True:
        rep = api("GET", f"{chemin}{sep}per_page=50&page={page}")
        resultats += rep.get(cle, [])
        suivante = (rep.get("meta") or {}).get("pagination", {}).get("next_page")
        if not suivante:
            return resultats
        page = suivante


def serveur_par_nom():
    serveurs = api("GET", f"/servers?name={NOM}").get("servers", [])
    return serveurs[0] if serveurs else None


def lieu_de(obj):
    if obj.get("location"):
        return obj["location"].get("name")
    return ((obj.get("datacenter") or {}).get("location") or {}).get("name")


def maintenant():
    return dt.datetime.now(dt.timezone.utc)


def date_iso(texte):
    return dt.datetime.fromisoformat(texte.replace("Z", "+00:00"))


def ecrire_sortie(**valeurs):
    """Transmet des valeurs aux étapes suivantes du workflow GitHub."""
    chemin = os.environ.get("GITHUB_OUTPUT")
    if chemin:
        with open(chemin, "a", encoding="utf-8") as f:
            for cle, val in valeurs.items():
                f.write(f"{cle}={val}\n")


# ---------------------------------------------------------------------------
# Prix (dans la devise et avec la TVA du propriétaire du projet Hetzner)
# ---------------------------------------------------------------------------
class Tarifs:
    def __init__(self, pricing):
        self.p = pricing
        self.devise = pricing.get("currency", "?")

    @staticmethod
    def _brut(prix):
        return float((prix or {}).get("gross") or (prix or {}).get("net") or 0)

    def serveur_horaire(self, serveur):
        lieu = lieu_de(serveur)
        listes = [(serveur.get("server_type") or {}).get("prices") or []]
        nom_type = (serveur.get("server_type") or {}).get("name")
        for st in self.p.get("server_types", []):
            if st.get("name") == nom_type:
                listes.append(st.get("prices") or [])
        for prix in listes:
            for ligne in prix:
                if ligne.get("location") == lieu:
                    return self._brut(ligne.get("price_hourly"))
        for prix in listes:  # emplacement introuvable : premier prix connu
            if prix:
                return self._brut(prix[0].get("price_hourly"))
        return 0.0

    def ipv4_horaire(self, lieu):
        for ip in self.p.get("primary_ips", []):
            if ip.get("type") == "ipv4":
                prix = ip.get("prices") or []
                for ligne in prix:
                    if ligne.get("location") == lieu:
                        return self._brut(ligne.get("price_hourly"))
                if prix:
                    return self._brut(prix[0].get("price_hourly"))
        return 0.0

    def go_mois(self, ressource):
        return self._brut((self.p.get(ressource) or {}).get("price_per_gb_month"))


def heures_facturees(debut, fin):
    """Hetzner arrondit à l'heure supérieure, avec au moins une heure."""
    return max(1, math.ceil((fin - debut).total_seconds() / 3600))


# ---------------------------------------------------------------------------
# Garde-budget
# ---------------------------------------------------------------------------
def inventaire(tarifs, instant):
    """Ressources payantes existantes, avec leur coût cumulé depuis leur création."""
    res = {}
    for s in lister("/servers", "servers"):
        cree = date_iso(s["created"])
        h = heures_facturees(cree, instant)
        res[f"serveur:{s['id']}"] = {
            "genre": "serveur", "nom": s["name"], "type": s["server_type"]["name"],
            "lieu": lieu_de(s), "statut": s["status"], "cree": s["created"],
            "ipv4": ((s.get("public_net") or {}).get("ipv4") or {}).get("ip"),
            "taux": tarifs.serveur_horaire(s), "heures": h,
            "cout": round(h * tarifs.serveur_horaire(s), 4),
        }
    for ip in lister("/primary_ips", "primary_ips"):
        if ip.get("type") != "ipv4":
            continue  # les IPv6 sont gratuites
        cree = date_iso(ip["created"])
        h = heures_facturees(cree, instant)
        taux = tarifs.ipv4_horaire(lieu_de(ip))
        res[f"ip:{ip['id']}"] = {
            "genre": "ip", "nom": ip.get("ip"), "statut": "attachée" if ip.get("assignee_id") else "libre",
            "conservee": ip.get("name") == NOM_IP,
            "cree": ip["created"], "taux": taux, "heures": h, "cout": round(h * taux, 4),
        }
    for img in lister("/images?type=snapshot", "images"):
        cree = date_iso(img["created"])
        h = heures_facturees(cree, instant)
        taille = float(img.get("image_size") or 0)
        taux = taille * tarifs.go_mois("image") / 730
        res[f"snapshot:{img['id']}"] = {
            "genre": "snapshot", "nom": img.get("description") or str(img["id"]),
            "statut": f"{taille:.1f} Go", "cree": img["created"], "taux": taux, "heures": h,
            "cout": round(h * taux, 4),
        }
    for vol in lister("/volumes", "volumes"):
        cree = date_iso(vol["created"])
        h = heures_facturees(cree, instant)
        taux = float(vol.get("size") or 0) * tarifs.go_mois("volume") / 730
        res[f"volume:{vol['id']}"] = {
            "genre": "volume", "nom": vol["name"], "statut": f"{vol.get('size')} Go",
            "cree": vol["created"], "taux": taux, "heures": h, "cout": round(h * taux, 4),
        }
    return res


def evenements(avant, apres):
    """Ce qui a changé depuis le dernier passage, en phrases lisibles."""
    ev = []
    for cle, r in apres.items():
        ancien = avant.get(cle)
        if r["genre"] == "serveur":
            if ancien is None or ancien.get("supprime"):
                ev.append(f"🟢 **Serveur créé** : `{r['nom']}` ({r['type']}, {r['lieu']}), IP {r['ipv4']}")
            else:
                if ancien.get("statut") != r["statut"]:
                    if r["statut"] == "running":
                        ev.append(f"▶️ **Serveur démarré** : `{r['nom']}`")
                    elif r["statut"] == "off":
                        ev.append(f"⏹️ **Serveur arrêté** : `{r['nom']}` (toujours facturé tant qu'il existe)")
                    else:
                        ev.append(f"ℹ️ Serveur `{r['nom']}` : état {r['statut']}")
                if ancien.get("type") != r["type"]:
                    ev.append(f"↕️ **Taille modifiée** : `{r['nom']}` passe de {ancien.get('type')} à {r['type']}")
        elif r["genre"] == "ip":
            if r["statut"] == "libre" and (ancien is None or ancien.get("statut") != "libre"):
                if r.get("conservee"):
                    ev.append(f"📌 Adresse {r['nom']} conservée pour la prochaine création "
                              f"(même adresse de site, ≈ 0,02 $ par jour)")
                else:
                    ev.append(f"➕ **Adresse IPv4 non attachée** : {r['nom']} — payante tant qu'elle existe")
        elif ancien is None or ancien.get("supprime"):
            libelle = {"snapshot": "Snapshot", "volume": "Volume"}[r["genre"]]
            ev.append(f"➕ **{libelle} créé(e)** : {r['nom']} ({r['statut']}) — payant")
    for cle, r in avant.items():
        if cle not in apres and not r.get("supprime"):
            if r["genre"] == "serveur":
                ev.append(f"🔴 **Serveur supprimé** : `{r['nom']}`")
            elif r["genre"] != "ip":
                ev.append(f"➖ {r['genre'].capitalize()} supprimé(e) : {r['nom']}")
    return ev


def tableau(ressources, devise):
    lignes = ["| Ressource | État | Durée | Coût estimé |", "|---|---|---|---|"]
    for r in sorted(ressources.values(), key=lambda x: x["cree"]):
        etat = "supprimé(e)" if r.get("supprime") else r.get("statut", "")
        nom = r["nom"] if r["genre"] != "serveur" else f"{r['nom']} ({r.get('type')})"
        lignes.append(f"| {r['genre']} : {nom} | {etat} | {r['heures']} h | {r['cout']:.2f} {devise} |")
    return "\n".join(lignes)


def cmd_budget(args):
    budget = env_float("BUDGET", 25.0)
    seuil_alerte = env_float("ALERTE", 0.75) * budget
    seuil_arret = env_float("ARRET", 0.95) * budget
    heure_rapport = int(env_float("RAPPORT_HEURE", 18))
    prof = os.environ.get("RESPONSABLE", "").strip().lstrip("@")
    mention = f"@{prof} " if prof else ""

    etat_chemin = Path(args.etat)
    etat = json.loads(etat_chemin.read_text()) if etat_chemin.exists() and etat_chemin.read_text().strip() else {}
    avant = etat.get("ressources", {})

    instant = maintenant()
    tarifs = Tarifs(api("GET", "/pricing").get("pricing", {}))
    actuelles = inventaire(tarifs, instant)
    ev = evenements(avant, actuelles)

    # Fusion : on garde le coût des ressources supprimées (+1 h de marge).
    fusion = {}
    for cle, r in avant.items():
        if cle not in actuelles:
            r = dict(r)
            if not r.get("supprime"):
                r["supprime"] = True
                r["heures"] = r.get("heures", 0) + 1
                r["cout"] = round(r.get("cout", 0) + r.get("taux", 0), 4)
            fusion[cle] = r
    fusion.update(actuelles)

    total = sum(r["cout"] for r in fusion.values())
    rythme = sum(r["taux"] for r in actuelles.values())  # coût par heure en ce moment
    serveurs_actifs = [r for r in actuelles.values() if r["genre"] == "serveur"]
    devise = tarifs.devise
    pct = 100 * total / budget if budget else 0

    alerte = arret = False
    if total >= seuil_alerte and not etat.get("alerte_envoyee"):
        alerte = True
        etat["alerte_envoyee"] = True
        ev.append(f"⚠️ {mention}**Alerte budget** : {total:.2f} {devise} consommés sur {budget:.0f} "
                  f"({pct:.0f} %). Préparez la sauvegarde finale.")
    if total >= seuil_arret and serveurs_actifs:
        arret = True
        etat["arret_declenche"] = True
        ev.append(f"🛑 {mention}**Plafond atteint** : {total:.2f} {devise} sur {budget:.0f} ({pct:.0f} %). "
                  f"Sauvegarde finale puis suppression automatique du serveur.")
    if any(r["genre"] in ("snapshot", "volume") for r in actuelles.values()):
        ev.append("💡 Des snapshots ou volumes existent : ils sont facturés en plus du serveur.")

    aujourdhui = instant.date().isoformat()
    rapport_du_jour = instant.hour >= heure_rapport and etat.get("dernier_rapport") != aujourdhui
    if rapport_du_jour or args.forcer_rapport:
        etat["dernier_rapport"] = aujourdhui

    lignes = []
    if ev:
        lignes += ev
    if ev or rapport_du_jour or args.forcer_rapport:
        restant = max(0.0, seuil_arret - total)
        jours = (restant / rythme / 24) if rythme > 0 else None
        titre = "📊 **Rapport quotidien**" if (rapport_du_jour or args.forcer_rapport) else "📊 Situation"
        lignes += ["", titre + f" — {instant:%d/%m/%Y %H:%M} UTC", "",
                   f"- Consommé (estimation prudente) : **{total:.2f} {devise}** sur {budget:.0f} ({pct:.0f} %)",
                   f"- Rythme actuel : {rythme * 24:.2f} {devise} par jour",
                   f"- Arrêt automatique à {seuil_arret:.2f} {devise}"
                   + (f", soit dans ≈ {jours:.1f} jours à ce rythme" if jours is not None else ""),
                   "", tableau(fusion, devise) if fusion else "_Aucune ressource payante._"]

    Path(args.rapport).write_text("\n".join(lignes) + "\n", encoding="utf-8")
    etat.update({"ressources": fusion, "devise": devise, "total": round(total, 4),
                 "budget": budget, "mis_a_jour": instant.isoformat()})
    etat_chemin.write_text(json.dumps(etat, indent=2, ensure_ascii=False), encoding="utf-8")
    ecrire_sortie(commenter=str(bool(lignes)).lower(), alerte=str(alerte).lower(),
                  arret=str(arret).lower(), total=f"{total:.2f}", devise=devise)
    print("\n".join(lignes) if lignes else f"RAS : {total:.2f} {devise} sur {budget:.0f}")


# ---------------------------------------------------------------------------
# Création / suppression / adresse
# ---------------------------------------------------------------------------
def cloud_init(dossier_cles):
    dossier = Path(dossier_cles)
    deploy = dossier / "deploy.pub"
    if not deploy.exists():
        sys.exit(f"{deploy} introuvable : générez la clé de déploiement (voir le guide).")
    comptes = {"deploy": deploy.read_text().strip()}
    for f in sorted(dossier.glob("*.pub")):
        login = f.stem
        if login == "deploy":
            continue
        if not re.fullmatch(r"[a-z][a-z0-9_-]{1,30}", login):
            sys.exit(f"Nom de fichier invalide : {f.name} (attendu : login.pub, en minuscules)")
        comptes[login] = f.read_text().strip()
    for login, cle in comptes.items():
        if not re.match(r"^ssh-(ed25519|rsa) ", cle):
            sys.exit(f"La clé de {login} ne ressemble pas à une clé PUBLIQUE SSH")

    q = json.dumps  # une chaîne JSON est une chaîne YAML valide
    lignes = ["#cloud-config", "package_update: true", "package_upgrade: true",
              "packages: [fail2ban, unattended-upgrades, git, curl]", "users:"]
    for login, cle in comptes.items():
        lignes += [f"  - name: {login}", "    shell: /bin/bash",
                   "    sudo: " + q("ALL=(ALL) NOPASSWD:ALL"),
                   "    ssh_authorized_keys:", f"      - {q(cle)}"]
    lignes += ["write_files:", "  - path: /etc/ssh/sshd_config.d/99-durcissement.conf",
               "    content: |", "      PermitRootLogin no", "      PasswordAuthentication no",
               "      KbdInteractiveAuthentication no", "runcmd:",
               "  - " + q("curl -fsSL https://get.docker.com | sh")]
    for login in comptes:
        lignes.append("  - " + q(f"usermod -aG docker {login}"))
    lignes += ["  - " + q("fallocate -l 2G /swapfile && chmod 600 /swapfile && mkswap /swapfile "
                          "&& swapon /swapfile && echo '/swapfile none swap sw 0 0' >> /etc/fstab"),
               "  - " + q("echo vm.swappiness=10 > /etc/sysctl.d/99-swap.conf && sysctl --system"),
               "  - " + q("mkdir -p /opt/projet1 && chown deploy:deploy /opt/projet1"),
               "  - " + q("systemctl restart ssh")]
    return "\n".join(lignes) + "\n", deploy.read_text().strip(), list(comptes)


def assurer_parefeu():
    existants = api("GET", f"/firewalls?name={NOM_PAREFEU}").get("firewalls", [])
    if existants:
        return existants[0]["id"]
    partout = ["0.0.0.0/0", "::/0"]
    regles = [{"direction": "in", "protocol": "tcp", "port": p, "source_ips": partout, "description": d}
              for p, d in (("22", "SSH"), ("80", "HTTP"), ("443", "HTTPS"))]
    regles.append({"direction": "in", "protocol": "icmp", "source_ips": partout, "description": "ping"})
    return api("POST", "/firewalls", {"name": NOM_PAREFEU, "rules": regles})["firewall"]["id"]


def assurer_cle(cle_publique):
    existantes = api("GET", f"/ssh_keys?name={NOM_CLE}").get("ssh_keys", [])
    if existantes and existantes[0]["public_key"].split()[:2] == cle_publique.split()[:2]:
        return
    if existantes:
        api("DELETE", f"/ssh_keys/{existantes[0]['id']}")
    api("POST", "/ssh_keys", {"name": NOM_CLE, "public_key": cle_publique})


def cmd_creer(args):
    if os.environ.get("SERVEUR_IP", "").strip():
        sys.exit("La variable SERVEUR_IP désigne un serveur hors Hetzner : ce workflow ne sert "
                 "qu'avec Hetzner. Créez ou arrêtez ce serveur depuis son propre portail.")
    if serveur_par_nom():
        sys.exit(f"Un serveur nommé {NOM} existe déjà : supprimez-le d'abord ou utilisez-le.")
    etat = Path(args.etat)
    if etat.exists() and etat.read_text().strip():
        e = json.loads(etat.read_text())
        budget = env_float("BUDGET", 25.0)
        if e.get("total", 0) >= env_float("ARRET", 0.95) * budget:
            sys.exit(f"Création refusée : budget épuisé ({e['total']:.2f} sur {budget:.0f}).")
    donnees, cle_deploy, comptes = cloud_init(args.cles)
    pare_feu = assurer_parefeu()
    assurer_cle(cle_deploy)
    reseau = {"enable_ipv4": True, "enable_ipv6": True}
    ip_gardee = adresse_conservee()
    if ip_gardee and not ip_gardee.get("assignee_id"):
        if lieu_de(ip_gardee) in (None, LIEU):
            reseau["ipv4"] = ip_gardee["id"]
            print(f"Réutilisation de l'adresse conservée {ip_gardee['ip']}")
        else:
            print(f"L'adresse conservée est à {lieu_de(ip_gardee)}, pas à {LIEU} : nouvelle adresse.")
    rep = api("POST", "/servers", {
        "name": NOM, "server_type": TYPE, "image": "ubuntu-24.04", "location": LIEU,
        "ssh_keys": [NOM_CLE], "user_data": donnees, "firewalls": [{"firewall": pare_feu}],
        "labels": {"projet": NOM}, "public_net": reseau, "start_after_create": True,
    })
    sid = rep["server"]["id"]
    for _ in range(60):
        s = api("GET", f"/servers/{sid}")["server"]
        if s["status"] == "running":
            break
        time.sleep(5)
    ip = s["public_net"]["ipv4"]["ip"]
    ip_id = s["public_net"]["ipv4"].get("id")
    if ip_id and not (ip_gardee and ip_gardee["id"] == ip_id):
        # Garder cette adresse après suppression du serveur : même URL à la prochaine création.
        api("PUT", f"/primary_ips/{ip_id}", {"name": NOM_IP, "auto_delete": False})
    ecrire_sortie(ip=ip, comptes=" ".join(comptes))
    print(f"Serveur {NOM} ({TYPE}, {LIEU}) créé : {ip} — comptes : {', '.join(comptes)}")


def adresse_conservee():
    ips = api("GET", f"/primary_ips?name={NOM_IP}").get("primary_ips", [])
    return ips[0] if ips else None


def cmd_supprimer(args):
    """Supprime le serveur. --liberer-ip : supprime aussi l'adresse conservée (fin de projet).
    --tous : tous les serveurs et toutes les adresses IPv4 du projet (plafond de budget)."""
    cibles = lister("/servers", "servers") if args.tous else [s for s in [serveur_par_nom()] if s]
    for s in cibles:
        api("DELETE", f"/servers/{s['id']}")
        print(f"Serveur supprimé : {s['name']}")
    ecrire_sortie(supprimes=" ".join(s["name"] for s in cibles))
    if not cibles:
        print("Aucun serveur à supprimer.")

    if args.tous or args.liberer_ip:
        a_liberer = ([ip for ip in lister("/primary_ips", "primary_ips") if ip.get("type") == "ipv4"]
                     if args.tous else [ip for ip in [adresse_conservee()] if ip])
        for ip in a_liberer:
            for _ in range(24):  # l'adresse se détache quelques secondes après la suppression
                if not api("GET", f"/primary_ips/{ip['id']}")["primary_ip"].get("assignee_id"):
                    break
                time.sleep(5)
            api("DELETE", f"/primary_ips/{ip['id']}")
            print(f"Adresse IPv4 libérée : {ip.get('ip')}")
        ecrire_sortie(ip_liberee=" ".join(ip.get("ip", "") for ip in a_liberer))


def cmd_cloud_init(args):
    print(cloud_init(args.cles)[0], end="")


def cmd_ip(_args):
    externe = os.environ.get("SERVEUR_IP", "").strip()
    if externe:
        print(externe)
        return
    s = serveur_par_nom()
    if not s:
        print(f"Aucun serveur nommé {NOM}.", file=sys.stderr)
        sys.exit(3)
    print(s["public_net"]["ipv4"]["ip"])


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sous = p.add_subparsers(dest="commande", required=True)
    sous.add_parser("ip")
    ci = sous.add_parser("cloud-init")
    ci.add_argument("--cles", default="infra/cles-ssh")
    c = sous.add_parser("creer")
    c.add_argument("--cles", default="infra/cles-ssh")
    c.add_argument("--etat", default="etat-budget.json")
    s = sous.add_parser("supprimer")
    s.add_argument("--tous", action="store_true")
    s.add_argument("--liberer-ip", action="store_true")
    b = sous.add_parser("budget")
    b.add_argument("--etat", default="etat-budget.json")
    b.add_argument("--rapport", default="rapport.md")
    b.add_argument("--forcer-rapport", action="store_true")
    args = p.parse_args()
    {"ip": cmd_ip, "cloud-init": cmd_cloud_init, "creer": cmd_creer, "supprimer": cmd_supprimer,
     "budget": cmd_budget}[args.commande](args)


if __name__ == "__main__":
    main()
