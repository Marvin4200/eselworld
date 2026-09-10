#!/bin/sh
set -e

echo "→ Running pending Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

# Demo-Seed bei leerer DB — bewusst NICHT fatal: falls das aus irgendeinem
# Grund fehlschlägt, soll der Server trotzdem hochkommen statt den Container
# in einer Crash-Loop zu versenken (siehe Revert von dc3edfa).
node node_modules/tsx/dist/cli.mjs prisma/seed-if-empty.ts || echo "→ Seed-Check fehlgeschlagen, starte trotzdem weiter."

exec "$@"
