// Läuft bei jedem Containerstart (siehe docker-entrypoint.sh) nach den
// Migrationen. Seedet die Demo-Daten NUR, wenn die DB noch leer ist — sobald
// die erste echte (oder Demo-)Community existiert, ist das für immer ein
// No-Op, seed.ts (das die DB wipe't) läuft dann nie wieder automatisch.
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const count = await prisma.community.count();
await prisma.$disconnect();

if (count === 0) {
  console.log("→ Datenbank leer, lade Demo-Daten...");
  execSync("node node_modules/tsx/dist/cli.mjs prisma/seed.ts", { stdio: "inherit" });
} else {
  console.log(`→ Datenbank enthält bereits ${count} Communities, Seed übersprungen.`);
}
