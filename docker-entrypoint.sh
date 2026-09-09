#!/bin/sh
set -e

echo "→ Running pending Prisma migrations..."
npx prisma migrate deploy

exec "$@"
