# syntax=docker/dockerfile:1

# ---- deps -------------------------------------------------------------
# Installiert alle Dependencies (inkl. devDependencies, da "prisma" die CLI
# fürs spätere "migrate deploy" im Runtime-Image ist) einmal, gecacht per
# package-lock.json.
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder ------------------------------------------------------------
# Generiert den Prisma-Client (inkl. musl-Engine für Alpine) und baut die
# Next.js-App (App Router, Turbopack) zu einem eigenständigen Bundle
# (next.config.ts: output: "standalone").
FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ---- runner ---------------------------------------------------------------
# Minimales Laufzeit-Image: nur das getracte Standalone-Bundle + statische
# Assets + Prisma-CLI/Schema (für "prisma migrate deploy" beim Containerstart).
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Schema + Migrationshistorie sowie die Prisma-CLI selbst (die Standalone-
# Trace enthält nur den generierten Client, nicht das CLI-Paket). src/ wird
# gebraucht, weil prisma/seed.ts beim Erststart per tsx direkt (nicht aus dem
# kompilierten Next-Bundle) importiert wird — siehe seed-if-empty.ts.
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma

COPY --chown=nextjs:nodejs docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

USER nextjs

ENV PORT=3000
ENV HOSTNAME=0.0.0.0
EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
