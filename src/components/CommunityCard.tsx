import Link from "next/link";
import type { CommunitySummary } from "@/lib/types";
import CityTierBadge from "@/components/CityTierBadge";
import { computeBadges } from "@/lib/badges";

const ACTIVITY_STYLE: Record<string, string> = {
  "Sehr hoch": "text-teal",
  Hoch: "text-teal",
  Mittel: "text-accent-ink",
  Niedrig: "text-ink-faint",
};

export default function CommunityCard({ c }: { c: CommunitySummary }) {
  const badges = computeBadges(c).slice(0, 2);

  return (
    <Link
      href={`/community/${c.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-line bg-bg-raised p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-teal hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
          style={{ backgroundColor: `${c.colorHex}22` }}
        >
          {c.iconEmoji}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-lg font-semibold text-ink group-hover:text-teal">
            {c.name}
          </h3>
          <p className="text-sm text-ink-faint">
            {c.category.icon} {c.category.name} · {c.language}
          </p>
        </div>
        {c.alliance && (
          <span
            title={`Bündnis: ${c.alliance.name}`}
            className="ml-auto shrink-0 rounded-full px-2 py-1 text-xs"
            style={{ backgroundColor: `${c.alliance.colorHex}22`, color: c.alliance.colorHex }}
          >
            {c.alliance.icon}
          </span>
        )}
      </div>

      <p className="line-clamp-2 text-sm text-ink-soft">{c.description}</p>

      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {badges.map((b) => (
            <span
              key={b.label}
              className="rounded-full bg-bg-sunken px-2 py-0.5 text-xs text-ink-soft"
            >
              {b.icon} {b.label}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <CityTierBadge level={c.level} />
        <span className="text-xs text-ink-faint">
          👥 {c.memberCount.toLocaleString("de-DE")}
        </span>
        <span
          className={`text-xs font-medium ${ACTIVITY_STYLE[c.activityLabel] ?? "text-ink-soft"}`}
        >
          ● {c.activityLabel}
        </span>
        <span className="text-xs text-teal">
          📈 +{c.growthPercent.toFixed(0)}%
        </span>
      </div>
    </Link>
  );
}
