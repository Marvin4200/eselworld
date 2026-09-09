import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCommunityDetail, getFavoriteCommunityIds } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { tierForLevel } from "@/lib/cityTier";
import { computeBadges } from "@/lib/badges";
import CityTierBadge from "@/components/CityTierBadge";
import CommunityCard from "@/components/CommunityCard";
import XpProgressBar from "@/components/XpProgressBar";
import ActivitySparkline from "@/components/ActivitySparkline";
import ShareButton from "@/components/ShareButton";
import FavoriteButton from "@/components/FavoriteButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = await getCommunityDetail(slug);
  if (!c) return { title: "Community nicht gefunden" };
  return {
    title: `${c.name} — ${c.category.name}`,
    description: `${c.description.slice(0, 140)} · Level ${c.level} · ${c.memberCount.toLocaleString("de-DE")} Mitglieder auf EselWorld.`,
  };
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [c, currentUser] = await Promise.all([getCommunityDetail(slug), getCurrentUser()]);
  if (!c) notFound();

  const favoriteIds = currentUser ? await getFavoriteCommunityIds(currentUser.id) : new Set<string>();
  const tier = tierForLevel(c.level);
  const badges = computeBadges({
    level: c.level,
    growthPercent: c.growthPercent,
    activityLabel: c.activityLabel,
    currentStreak: c.currentStreak,
    createdAt: c.createdAt,
  });
  const founded = c.createdAt.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link
        href={`/land/${c.category.slug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-ink-faint hover:text-ink"
      >
        ← Zurück zu {c.category.icon} {c.category.name}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span
            className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl"
            style={{ backgroundColor: `${c.colorHex}22` }}
          >
            {c.iconEmoji}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-display text-3xl font-semibold text-ink">{c.name}</h1>
              {c.alliance && (
                <Link
                  href={`/alliance/${c.alliance.slug}`}
                  title={`Bündnis: ${c.alliance.name}`}
                  className="rounded-full px-2.5 py-1 text-sm"
                  style={{ backgroundColor: `${c.alliance.colorHex}22`, color: c.alliance.colorHex }}
                >
                  {c.alliance.icon} {c.alliance.name}
                </Link>
              )}
            </div>
            <p className="mt-1 text-ink-faint">
              <Link href={`/land/${c.category.slug}`} className="hover:text-teal">
                {c.category.icon} {c.category.name}
              </Link>{" "}
              · 🇩🇪 {c.language} · Gegründet am {founded}
            </p>
          </div>
        </div>
        <div className="text-right text-xs text-ink-faint">
          <p>🌍 Platz {c.rankGlobal} weltweit</p>
          <p>{c.category.icon} Platz {c.rankInLand} in {c.category.name}</p>
        </div>
      </div>

      {badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span
              key={b.label}
              className="rounded-full border border-line bg-bg-raised px-2.5 py-1 text-xs text-ink-soft"
            >
              {b.icon} {b.label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Stadt-Level" value={`${tier.emoji} ${c.level}`} />
        <StatTile label="Mitglieder" value={c.memberCount.toLocaleString("de-DE")} />
        <StatTile label="Aktivität" value={c.activityLabel} accent />
        <StatTile label="Wachstum" value={`+${c.growthPercent.toFixed(0)}%`} accent />
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-bg-raised p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Stadtentwicklung</h2>
          <span className="text-xs text-ink-faint">🔥 {c.currentStreak} Tage Streak</span>
        </div>
        <div className="mt-3">
          <XpProgressBar xpTotal={c.xpTotal} />
        </div>
        <div className="mt-4">
          <p className="mb-2 text-xs uppercase tracking-wide text-ink-faint">
            Aktivität, letzte 14 Tage
          </p>
          <ActivitySparkline points={c.recentActivity} />
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">
          Beschreibung
        </h2>
        <p className="mt-2 leading-relaxed text-ink-soft">{c.description}</p>
      </section>

      <section className="mt-6">
        <h2 className="font-display text-lg font-semibold text-ink">Tags</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {c.tags.map((t) => (
            <Link
              key={t}
              href={`/discover?tag=${encodeURIComponent(t)}`}
              className="rounded-full bg-bg-sunken px-3 py-1 text-sm text-ink-soft hover:bg-teal-soft hover:text-teal"
            >
              #{t}
            </Link>
          ))}
        </div>
      </section>

      {c.owner && (
        <Link
          href={`/u/${c.owner.username}`}
          className="mt-6 flex items-center gap-3 rounded-2xl border border-line-soft bg-bg-sunken p-4 transition hover:border-teal"
        >
          <span className="grid h-10 w-10 place-items-center rounded-full bg-teal-soft text-lg">
            {c.owner.avatarEmoji}
          </span>
          <p className="text-sm text-ink-soft">
            Gegründet und geführt von <strong className="text-ink">{c.owner.username}</strong>
          </p>
        </Link>
      )}

      <div className="mt-10 flex flex-col gap-3 sm:flex-row">
        <a
          href={c.inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-full bg-ink px-6 py-3 text-center font-medium text-bg transition hover:opacity-85"
        >
          💬 Community beitreten
        </a>
        <Link
          href={`/land/${c.category.slug}`}
          className="rounded-full border border-line px-6 py-3 text-center font-medium text-ink hover:border-teal"
        >
          🗺️ Auf der Karte ansehen
        </Link>
        {currentUser && (
          <FavoriteButton communityId={c.id} communitySlug={c.slug} isFavorite={favoriteIds.has(c.id)} />
        )}
        <ShareButton title={`${c.name} auf EselWorld`} />
        <CityTierBadge level={c.level} />
      </div>

      {c.similar.length > 0 && (
        <section className="mt-14">
          <h2 className="font-display text-lg font-semibold text-ink">
            Weitere Communities in {c.category.name}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {c.similar.map((s) => (
              <CommunityCard key={s.id} c={s} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-line bg-bg-raised p-3">
      <p className="text-xs uppercase tracking-wide text-ink-faint">{label}</p>
      <p className={`mt-1 font-display text-lg font-semibold ${accent ? "text-teal" : "text-ink"}`}>
        {value}
      </p>
    </div>
  );
}
