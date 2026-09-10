// Läuft bei jedem Containerstart (siehe docker-entrypoint.sh) nach den
// Migrationen. Seedet die Demo-Daten NUR, wenn die DB noch leer ist — sobald
// die erste echte (oder Demo-)Community existiert, ist das für immer ein
// No-Op, seed.ts (das die DB wipe't) läuft dann nie wieder automatisch.
//
// Kein Top-Level-await hier (bewusst wie in seed.ts): package.json hat kein
// "type": "module", tsx führt .ts-Dateien ohne dieses Feld als CommonJS aus,
// und CommonJS kennt kein Top-Level-await — das crasht den Prozess sofort.
import { execSync } from "node:child_process";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.community.count();
  if (count === 0) {
    console.log("→ Datenbank leer, lade Demo-Daten...");
    execSync("node node_modules/tsx/dist/cli.mjs prisma/seed.ts", { stdio: "inherit" });
  } else {
    console.log(`→ Datenbank enthält bereits ${count} Communities, Seed übersprungen.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
