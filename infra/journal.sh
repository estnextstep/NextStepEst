#!/usr/bin/env bash
# Publie un message (fichier Markdown) dans l'issue « Journal du projet 1 ».
# Toute personne abonnée à cette issue (la responsable du projet) reçoit un e-mail par message.
# Usage dans un workflow : bash infra/journal.sh message.md
# Variables : GH_TOKEN et GH_REPO (fournies par le workflow), JOURNAL_ISSUE (facultative)
set -euo pipefail
FICHIER="${1:?Usage : bash infra/journal.sh message.md}"
TITRE="Journal du projet 1"

NUM="${JOURNAL_ISSUE:-}"
if [ -z "$NUM" ]; then
  NUM="$(gh issue list --state all --limit 200 --json number,title \
    --jq "[.[] | select(.title == \"$TITRE\")][0].number // empty")"
fi
if [ -z "$NUM" ]; then
  echo "::warning::Issue « $TITRE » introuvable : créez-la (voir le guide). Message non publié :"
  cat "$FICHIER"
  exit 0
fi

LIEN="$GITHUB_SERVER_URL/$GITHUB_REPOSITORY/actions/runs/$GITHUB_RUN_ID"
{
  cat "$FICHIER"
  printf '\n<sub>%s · lancé par %s · [détails](%s)</sub>\n' \
    "$GITHUB_WORKFLOW" "$GITHUB_ACTOR" "$LIEN"
} > "${RUNNER_TEMP:-/tmp}/journal-message.md"

gh issue comment "$NUM" --body-file "${RUNNER_TEMP:-/tmp}/journal-message.md"
