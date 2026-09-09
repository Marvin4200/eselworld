import { tierForLevel } from "@/lib/cityTier";

export default function CityTierBadge({ level }: { level: number }) {
  const tier = tierForLevel(level);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg-raised px-2.5 py-1 text-xs font-medium text-ink-soft">
      <span>{tier.emoji}</span>
      {tier.name}
      <span className="text-ink-faint">· Lv. {level}</span>
    </span>
  );
}
