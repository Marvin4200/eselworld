import Link from "next/link";
import { getTopCommunities } from "@/lib/queries";
import { LANDS } from "@/lib/worldMap";
import { tierForLevel } from "@/lib/cityTier";
import CityTierBadge from "@/components/CityTierBadge";

export const metadata = { title: "Ranking" };

const RANK_MEDAL: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

export default async function RankingPage({
  searchParams,
}: {
  searchParams: Promise<{ land?: string }>;
}) {
  const { land: landSlug } = await searchParams;
  const activeLand = LANDS.find((l) => l.id === landSlug);
  const communities = await getTopCommunities({ landSlug: activeLand?.id, limit: 30 });

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
        Ranking
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink">
        {activeLand ? `${activeLand.icon} ${activeLand.name}` : "🌍 Weltweit"}
      </h1>
      <p className="mt-2 text-ink-soft">
        Sortiert nach Gesamt-XP der Stadt — die Kennzahl, die aus echter (bzw.
        simulierter) Discord-Aktivität wächst.
      </p>

      <div className="mt-6 flex flex-wrap gap-1.5">
        <Link
          href="/ranking"
          className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
            !activeLand
              ? "border-ink bg-ink text-bg"
              : "border-line text-ink-soft hover:border-teal"
          }`}
        >
          🌍 Weltweit
        </Link>
        {LANDS.map((l) => (
          <Link
            key={l.id}
            href={`/ranking?land=${l.id}`}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
              activeLand?.id === l.id
                ? "border-ink bg-ink text-bg"
                : "border-line text-ink-soft hover:border-teal"
            }`}
          >
            {l.icon} {l.name}
          </Link>
        ))}
      </div>

      {communities.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-bg-raised p-10 text-center text-ink-faint">
          Noch keine Communities in diesem Land.
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-2">
          {communities.map((c, i) => {
            const rank = i + 1;
            const tier = tierForLevel(c.level);
            return (
              <Link
                key={c.id}
                href={`/community/${c.slug}`}
                className="flex items-center gap-3 rounded-2xl border border-line bg-bg-raised p-3 transition hover:border-teal hover:shadow-sm"
              >
                <span className="w-8 shrink-0 text-center font-display text-lg font-semibold text-ink-faint">
                  {RANK_MEDAL[rank] ?? rank}
                </span>
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl"
                  style={{ backgroundColor: `${c.colorHex}22` }}
                >
                  {c.iconEmoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{c.name}</p>
                  <p className="truncate text-xs text-ink-faint">
                    {c.category.icon} {c.category.name} · {c.memberCount.toLocaleString("de-DE")} Mitglieder
                  </p>
                </div>
                <CityTierBadge level={c.level} />
                <span className="hidden shrink-0 font-mono text-xs text-ink-faint sm:block">
                  {tier.emoji} {Math.round(c.xpTotal).toLocaleString("de-DE")} XP
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
