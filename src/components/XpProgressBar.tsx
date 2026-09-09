import { levelProgress } from "@/lib/activityFormula";
import { tierForLevel } from "@/lib/cityTier";

export default function XpProgressBar({ xpTotal }: { xpTotal: number }) {
  const { level, xpIntoLevel, xpForNextLevel } = levelProgress(xpTotal);
  const tier = tierForLevel(level);
  const pct = Math.min(100, Math.round((xpIntoLevel / xpForNextLevel) * 100));

  return (
    <div>
      <div className="flex items-baseline justify-between text-xs text-ink-faint">
        <span>
          {tier.emoji} {tier.name} · Lv. {level}
        </span>
        <span className="font-mono">
          {Math.round(xpIntoLevel)} / {Math.round(xpForNextLevel)} XP
        </span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-bg-sunken">
        <div
          className="h-full rounded-full bg-teal transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
