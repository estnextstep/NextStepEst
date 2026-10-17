#!/usr/bin/env bash
# Exécuté SUR LE SERVEUR par le workflow « Serveur : créer » (ou à la main) :
#   ssh deploy@IP 'bash -s -- /tmp/sauvegarde.tar.gz' < infra/restauration-serveur.sh
# Restaure chaque base présente dans l'archive (produite par sauvegarde-serveur.sh).
# Convention de nommage : postgres-<service> et mongo-<service> (voir docker-compose.yml).
set -euo pipefail
ARCHIVE="${1:?Usage : restauration-serveur.sh /chemin/sauvegarde.tar.gz}"
cd /opt/projet1
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT
tar -xzf "$ARCHIVE" -C "$T"
CONTENEURS=" $(docker compose ps --services --status running | tr '\n' ' ') "

for f in "$T"/*; do
  fichier="$(basename "$f")"
  base="${fichier%.*}"
  if [[ "$CONTENEURS" != *" $base "* ]]; then
    echo "ignoré : $fichier (aucun conteneur $base en marche)"
    continue
  fi
  case "$fichier" in
    postgres-*.sql)
      service="${base#postgres-}"
      docker compose stop "$service" 2> /dev/null || true
      docker compose exec -T "$base" sh -c 'dropdb -U "$POSTGRES_USER" --if-exists "$POSTGRES_DB"'
      docker compose exec -T "$base" sh -c 'psql -q -U "$POSTGRES_USER" -d postgres' \
        < "$f" > /dev/null 2> "$T/erreurs.txt" || true
      docker compose start "$service" 2> /dev/null || true
      echo "restauré : $base" ;;
    mongo-*.archive)
      service="${base#mongo-}"
      docker compose stop "$service" 2> /dev/null || true
      docker compose exec -T "$base" sh -c 'mongorestore --quiet --archive --drop \
        --nsExclude="admin.*" -u "$MONGO_INITDB_ROOT_USERNAME" \
        -p "$MONGO_INITDB_ROOT_PASSWORD" --authenticationDatabase admin' < "$f"
      docker compose start "$service" 2> /dev/null || true
      echo "restauré : $base" ;;
    *)
      echo "ignoré : $fichier" ;;
  esac
done
rm -f "$ARCHIVE"
