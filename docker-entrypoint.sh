#!/bin/sh
set -e

echo "→ Running pending Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

node node_modules/tsx/dist/cli.mjs prisma/seed-if-empty.ts

exec "$@"
