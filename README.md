# 🫏 EselWorld

Entdecke deine nächste Community. Zweistufige Weltkarte (8 Länder → je bis zu
20 Community-Städte), Suche/Filter, ausführliche Community-Seiten mit Rang,
Badges und Bündnis-Zugehörigkeit, Rankings, Bündnisse, Einreichungs- und
Admin-Prüf-Flow. V2 (ohne Bot): echtes Aktivitäts-/XP-/Level-System, vorerst
gespeist durch eine Simulation statt durch Discord-Live-Daten. Details zum
ursprünglichen Gesamtkonzept siehe das veröffentlichte
[EselWorld Blueprint](https://claude.ai/code/artifact/621acd8b-3f88-41ff-81f7-1be887c503b7)
(Kartenkonzept dort inzwischen durch die Welt/Land-Hierarchie unten ersetzt).

## Gamification: Leveln, Ranking, Bündnisse

Der Produktfokus liegt auf drei Säulen: Stadt leveln (V2-Aktivitätssystem,
siehe unten), sich mit anderen Communities messen (`/ranking`, global und pro
Land, sortiert nach `xpTotal`), und sich zusammenschließen (`/alliances` —
Bündnisse, siehe `Alliance`-Modell in `schema.prisma`, eine Community gehört
zu höchstens einem Bündnis). Die Community-Seite (`(site)/community/[slug]`)
bündelt das sichtbar: Rang weltweit/im Land, berechnete Badges
(`src/lib/badges.ts` — keine eigene DB-Tabelle, rein aus Level/Streak/Wachstum
abgeleitet), XP-Fortschrittsbalken, Aktivitätsverlauf, Bündnis-Zugehörigkeit,
Gründer und ähnliche Communities im selben Land.

## Stack

Next.js (App Router) + TypeScript + Tailwind CSS v4, Prisma + Postgres,
Server Actions statt eigener Mutations-API.

## Loslegen

Lokal braucht es eine erreichbare Postgres-Instanz — am einfachsten über den
`postgres`-Service aus `docker-compose.yml` (Port `5482` ist absichtlich nur
an `127.0.0.1` gebunden, siehe `.env`):

```bash
docker compose up -d postgres
npm install
npm run db:migrate:deploy   # Migrationen anwenden (prisma/migrations)
npm run db:seed             # Demo-Daten laden (8 Länder, 10 Communities, 2 Nutzer)
npm run dev
```

App läuft auf http://localhost:3000.

## Deployment (Docker)

`Dockerfile` ist ein Drei-Stufen-Build (`deps` → `builder` → `runner`) auf
Node-Alpine-Basis, `next.config.ts` nutzt `output: "standalone"` für ein
minimales Runtime-Image. Der Container führt beim Start automatisch
`prisma migrate deploy` aus (`docker-entrypoint.sh`), bevor der Next.js-Server
startet.

```bash
docker compose up -d --build
```

Startet einen eigenständigen `eselworld`-Compose-Stack (eigenes
`eselworld_internal`-Netzwerk, eigenes Postgres-Volume) und bindet die App nur
an `127.0.0.1:3150` — ein Reverse-Proxy (nginx) auf dem Host übernimmt TLS
und das Routing auf die öffentliche Subdomain. Benötigte Env-Variablen siehe
`.env.example`.

## Demo-Login

Echtes Discord-OAuth2 ist in diesem MVP noch **nicht** angeschlossen (siehe
`src/lib/session.ts`). Unter `/login` wählst du stattdessen eines von zwei
Demo-Profilen (David, Mira), um den Einreichungs- und Admin-Flow zu testen.
`/admin` ist im Demo-Modus für jeden eingeloggten Nutzer erreichbar.

## Nützliche Skripte

- `npm run db:studio` — Prisma Studio, um die Datenbank visuell zu inspizieren
- `npm run db:seed` — setzt alle Daten zurück und lädt die Demo-Daten neu
- `npm run lint` / `npm run build` — Lint bzw. Produktions-Build

## Die Karte: Welt → Land → Community (zweistufig)

Die Karte ist zweistufig, angelehnt an ein Referenz-Design mit acht optisch
eigenständigen "Ländern" um einen zentralen Hub:

- **Level 1 — Weltkarte** (`/`, `WorldMapView.tsx`): zeigt alle 8 Länder
  (`LANDS` in `src/lib/worldMap.ts`) als farblich und formal eigenständige
  Inseln um den dekorativen "EselWorld"-Hub. Klick auf ein Land → `/land/[slug]`.
- **Level 2 — Land-Karte** (`/land/[slug]`, `LandMapView.tsx`): zeigt die
  Communities *dieses einen Landes* auf dessen eigener, größerer Insel —
  wiederverwendet dieselbe Inselform wie auf der Weltkarte, nur ohne die
  Verkleinerung. Jedes Land hat 7 feste Plätze (`LAND_PLOTS`, 56 insgesamt),
  belegte zeigen die Community, freie einen gestrichelten "+"-Marker anklickbar
  zu "Community hier gründen".

Beide Ebenen sind eigene Next.js-Route-Groups: `(map)` ohne den normalen
Site-Header (eigenes, immer dunkles `MapHeader.tsx`-Chrome nach Referenzbild),
`(site)` mit dem gewohnten Header/Footer für alle Inhaltsseiten
(Entdecken, Community-Profil, Dashboard, Admin, …).

`assignFreePlot(landId)` in `src/lib/assignPlot.ts` vergibt bei Freischaltung
einen zufälligen freien Platz *innerhalb des gewählten Landes*; sind alle 7
belegt, wirft die Funktion bewusst einen Fehler statt einen 8. Platz zu
erfinden — dafür braucht es dann eine größere Kartenversion dieses Landes
(mehr `LAND_PLOTS`-Einträge, kein Datenbank-Refactor nötig).

Pan/Zoom (Pointer-Drag, Wheel-Zoom zum Cursor, +/−/Reset) ist auf beiden
Ebenen identisch implementiert; Beschriftungen blenden sich erst ab einer
Zoomstufe ein (`LABEL_ZOOM_THRESHOLD`), damit die Karte nicht überladen wirkt.
`Category` in der Datenbank *ist* ein Land — kein separates Modell, nur mit
den 8 Land-Slugs aus `worldMap.ts` statt der alten 7 Kategorien befüllt.

## Aktivitäts- und Level-System (V2, noch ohne Bot)

`src/lib/activityFormula.ts` implementiert die Punkte-/XP-/Level-Formel aus
dem Blueprint (gedeckelte Nachrichten-/Voice-Punkte pro Mitglied, Breiten-
und Wachstumsbonus, Streak-Multiplikator, überproportional wachsende
Level-Kosten). Diese Funktionen sind bewusst reine, bot-unabhängige
Funktionen — sie nehmen fertige "Punkte pro aktivem Mitglied" entgegen und
wissen nichts von Discord.

Solange kein Bot läuft, erzeugt `src/lib/simulateActivity.ts` einen
plausiblen Aktivitätstag aus der Mitgliederzahl einer Community. Owner lösen
das im Dashboard über den Button "🌱 Tag simulieren (Demo)" aus
(`simulateActivityDayAction` in `src/lib/actions.ts`); jeder Aufruf schreibt
eine Zeile in `ActivityDaily` und aktualisiert `Community.xpTotal` /
`level` / `currentStreak` / `activityLabel`.

**Bot-Integration später:** Nur `simulateMemberPoints()` in
`simulateActivity.ts` muss ersetzt werden — durch echte, vom Bot aggregierte
Tageswerte pro Mitglied. `computeDailyActivity()`, die Level-Kurve und das
gesamte Dashboard/UI bleiben unverändert.

## Von hier zu V2+ (Discord-Bot anschließen)

1. **Echtes Login**: `next-auth` mit Discord-Provider einrichten, `getCurrentUser()`
   in `src/lib/session.ts` auf die next-auth-Session umstellen.
2. **Bot**: eigener `discord.js`-Worker-Prozess (separates Deployment, z. B.
   Railway/Fly.io — Next.js/Vercel unterstützt keine dauerhaften
   Gateway-Verbindungen). Zählt Nachrichten/Voice-Minuten pro Mitglied und
   Tag, ruft täglich einmal dieselbe Formel wie `simulateActivityDay()` mit
   echten Zahlen auf (z. B. über einen neuen `POST /api/bot/activity`-Endpoint
   mit Service-Token-Auth statt Nutzer-Login).
4. **Anti-Farming**: Mindest-Kontoalter, Spam-/Duplikat-Erkennung und
   Bot-Account-Ausschluss passieren beim Sammeln der Rohdaten im Bot, bevor
   Werte an `computeDailyActivity()` übergeben werden — siehe Blueprint,
   Abschnitt 06.

Vollständiges Datenmodell, Formel-Herleitung und API-Struktur: siehe
Blueprint-Link oben.
