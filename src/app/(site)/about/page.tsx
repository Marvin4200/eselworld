import Link from "next/link";
import { getAlliances, getWorldStats } from "@/lib/queries";
import { CITY_TIERS } from "@/lib/cityTier";
import { LANDS } from "@/lib/worldMap";

export const metadata = { title: "Über uns" };

const STEPS = [
  {
    icon: "🌍",
    title: "Weltkarte erkunden",
    text: "Acht Länder, jedes mit eigener Farbwelt und eigenem Schwerpunkt — von Gaming Lands bis Esports Arena.",
  },
  {
    icon: "🗺️",
    title: "Ein Land betreten",
    text: "Klick auf ein Land und zoom in seine eigene, detaillierte Karte mit bis zu 20 Community-Plätzen.",
  },
  {
    icon: "🏙️",
    title: "Eine Stadt entdecken",
    text: "Jede Community-Stadt zeigt Level, Aktivität, Wachstum, Bündnis-Zugehörigkeit und Rang auf einen Blick.",
  },
  {
    icon: "💬",
    title: "Beitreten",
    text: "Ein Klick auf „Community beitreten“ führt direkt zum echten Discord-Invite.",
  },
];

const FAQ = [
  {
    q: "Ist EselWorld ein Discord-Ersatz?",
    a: "Nein. EselWorld ist reine Discovery — Chat, Voice und alles andere passiert weiterhin ganz normal auf Discord. Wir zeigen nur, wo es sich lohnt reinzuschauen.",
  },
  {
    q: "Wie wird meine Community geprüft?",
    a: "Jede Einreichung landet in einer Warteschlange und wird manuell freigeschaltet — meist innerhalb von 1–2 Tagen. Das verhindert Fake-Server und Spam-Einträge.",
  },
  {
    q: "Warum ist mein Level am Anfang nur geschätzt?",
    a: "Ohne Bot-Anbindung (kommt mit V2) schätzt ein Admin dein Startlevel grob anhand Mitgliederzahl und Beschreibung. Sobald du Aktivität simulierst oder später der Bot läuft, wächst dein echtes Level von dort aus weiter.",
  },
  {
    q: "Was passiert mit den Daten meines Discord-Servers?",
    a: "Nachrichteninhalte werden nie gespeichert oder angezeigt — nur aggregierte Tageswerte wie „X aktive Mitglieder“. Details in unserer Datenschutzerklärung.",
  },
];

export default async function AboutPage() {
  const [stats, alliances] = await Promise.all([getWorldStats(), getAlliances()]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
        Über EselWorld
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
        Entdecke deine nächste Community
      </h1>

      <p className="mt-5 max-w-2xl leading-relaxed text-ink-soft">
        EselWorld ist eine visuelle Discovery-Plattform für Discord-Communities.
        Statt einer nüchternen Serverliste bekommt jede registrierte Community
        eine eigene Stadt auf einer lebendigen Weltkarte — und die Möglichkeit,
        durch echte Aktivität zu wachsen, sich mit anderen zu verbünden und
        sich im Ranking zu messen.
      </p>

      {/* live stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile value={stats.communityCount} label="Communities" />
        <StatTile value={stats.memberCount.toLocaleString("de-DE")} label="Mitglieder" />
        <StatTile value={LANDS.length} label="Länder" />
        <StatTile value={alliances.length} label="Bündnisse" />
      </div>

      {/* how it works */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-ink">So funktioniert&apos;s</h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {STEPS.map((s, i) => (
            <div key={s.title} className="relative rounded-2xl border border-line bg-bg-raised p-4">
              <span className="absolute right-4 top-4 font-display text-2xl text-line">
                {i + 1}
              </span>
              <p className="text-2xl">{s.icon}</p>
              <p className="mt-2 font-medium text-ink">{s.title}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* leveling */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-ink">
          Deine Stadt wächst mit dir
        </h2>
        <p className="mt-2 max-w-2xl text-ink-soft">
          Jede Community startet klein und steigt durch Aktivität im Level auf.
          Fünf Ausbaustufen, klar sichtbar auf der Karte:
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {CITY_TIERS.map((t) => (
            <div
              key={t.name}
              className="flex items-center gap-2 rounded-full border border-line bg-bg-raised px-3 py-1.5 text-sm text-ink-soft"
            >
              <span>{t.emoji}</span>
              <span className="font-medium text-ink">{t.name}</span>
              <span className="text-xs text-ink-faint">
                Lv. {t.minLevel}
                {Number.isFinite(t.maxLevel) ? `–${t.maxLevel}` : "+"}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl border border-line-soft bg-bg-sunken p-4">
          <p className="font-medium text-ink">⚖️ Fair statt Farm</p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            100 unterschiedliche aktive Mitglieder zählen mehr als ein
            Mitglied mit 10.000 Nachrichten. Nachrichten- und Voice-Punkte pro
            Person sind gedeckelt, Wachstum und Streaks geben Bonus statt
            reiner Masse — Details in unserem{" "}
            <a
              href="https://claude.ai/code/artifact/621acd8b-3f88-41ff-81f7-1be887c503b7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal underline"
            >
              Blueprint
            </a>
            .
          </p>
        </div>
      </section>

      {/* alliances + ranking */}
      <section className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-line bg-bg-raised p-5">
          <p className="text-2xl">🤝</p>
          <p className="mt-2 font-display text-lg font-semibold text-ink">Bündnisse</p>
          <p className="mt-1 text-sm text-ink-soft">
            Communities schließen sich über Länder-Grenzen hinweg zusammen —
            kein Wettkampf, sondern gemeinsamer Auftritt und Sichtbarkeit.
          </p>
          <Link href="/alliances" className="mt-3 inline-block text-sm text-teal underline">
            Bündnisse ansehen →
          </Link>
        </div>
        <div className="rounded-2xl border border-line bg-bg-raised p-5">
          <p className="text-2xl">🏆</p>
          <p className="mt-2 font-display text-lg font-semibold text-ink">Ranking</p>
          <p className="mt-1 text-sm text-ink-soft">
            Weltweit oder pro Land — sortiert nach Gesamt-XP der Stadt. Wer
            wächst am konsequentesten?
          </p>
          <Link href="/ranking" className="mt-3 inline-block text-sm text-teal underline">
            Ranking ansehen →
          </Link>
        </div>
      </section>

      {/* roadmap */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-ink">Roadmap</h2>
        <div className="mt-5 flex flex-col gap-0 border-l-2 border-line pl-5">
          <RoadmapItem version="V1" title="Discovery" done>
            Weltkarte, Länder, Community-Städte, Suche, Bündnisse, Ranking, Admin-Prüfung.
          </RoadmapItem>
          <RoadmapItem version="V2" title="Aktivität" current>
            Echtes XP-/Level-System — aktuell durch Simulation gespeist, bereit für den Discord-Bot.
          </RoadmapItem>
          <RoadmapItem version="V3" title="Gamification">
            Saisons, seltene Badges, sichtbare Stadtentwicklung auf der Karte.
          </RoadmapItem>
          <RoadmapItem version="V4" title="Battles &amp; Territory" last>
            Community-Wettbewerbe und ein Territory-System — ohne Communities je zu zerstören.
          </RoadmapItem>
        </div>
      </section>

      {/* faq */}
      <section className="mt-14">
        <h2 className="font-display text-xl font-semibold text-ink">Häufige Fragen</h2>
        <div className="mt-5 flex flex-col divide-y divide-line-soft rounded-2xl border border-line bg-bg-raised">
          {FAQ.map((f) => (
            <details key={f.q} className="group p-4">
              <summary className="cursor-pointer list-none font-medium text-ink marker:content-none">
                <span className="mr-2 inline-block text-ink-faint transition group-open:rotate-90">
                  ▸
                </span>
                {f.q}
              </summary>
              <p className="mt-2 pl-5 text-sm leading-relaxed text-ink-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <div className="mt-14 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex-1 rounded-full bg-ink px-6 py-3 text-center font-medium text-bg transition hover:opacity-85"
        >
          🌍 Karte erkunden
        </Link>
        <Link
          href="/submit"
          className="flex-1 rounded-full border border-line px-6 py-3 text-center font-medium text-ink hover:border-teal"
        >
          + Community hinzufügen
        </Link>
      </div>
    </div>
  );
}

function StatTile({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-bg-raised p-3 text-center">
      <p className="font-display text-xl font-semibold text-ink">{value}</p>
      <p className="text-xs text-ink-faint">{label}</p>
    </div>
  );
}

function RoadmapItem({
  version,
  title,
  children,
  done,
  current,
  last,
}: {
  version: string;
  title: string;
  children: React.ReactNode;
  done?: boolean;
  current?: boolean;
  last?: boolean;
}) {
  return (
    <div className={`relative ${last ? "pb-0" : "pb-8"}`}>
      <span
        className={`absolute -left-[27px] top-1 h-3 w-3 rounded-full border-2 ${
          done
            ? "border-teal bg-teal"
            : current
              ? "border-teal bg-bg"
              : "border-line bg-bg"
        }`}
      />
      <p className="font-mono text-xs font-semibold text-teal">
        {version} {current && "· läuft gerade"}
      </p>
      <p className="mt-0.5 font-medium text-ink">{title}</p>
      <p className="mt-1 text-sm text-ink-soft">{children}</p>
    </div>
  );
}
