#!/usr/bin/env bash
# Exécuté SUR LE SERVEUR par le workflow « Sauvegarde des bases » :
#   ssh deploy@IP 'bash -s' < infra/sauvegarde-serveur.sh > sauvegarde.tar.gz
# Exporte chaque conteneur de base (PostgreSQL ou MongoDB) et écrit une archive
# .tar.gz sur la sortie standard. Rien n'est conservé sur le serveur.
set -euo pipefail
cd /opt/projet1
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT

for s in $(docker compose ps --services --status running); do
  image="$(docker compose ps --format '{{.Image}}' "$s")"
  case "$image" in
    postgres*)
      docker compose exec -T "$s" sh -c 'pg_dumpall -U "$POSTGRES_USER"' > "$T/$s.sql" ;;
    mongo*)
      docker compose exec -T "$s" sh -c 'mongodump --quiet --archive \
        -u "$MONGO_INITDB_ROOT_USERNAME" -p "$MONGO_INITDB_ROOT_PASSWORD" \
        --authenticationDatabase admin' > "$T/$s.archive" ;;
  esac
done

tar -C "$T" -czf - .
