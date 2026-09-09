#!/bin/sh
set -e

echo "→ Running pending Prisma migrations..."
node node_modules/prisma/build/index.js migrate deploy

exec "$@"
