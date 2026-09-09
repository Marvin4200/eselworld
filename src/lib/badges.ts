// Leichte, berechnete Badges statt einer eigenen DB-Tabelle — passt sich
// automatisch an, sobald echte Bot-Daten reinkommen. Ein echtes Badge-System
// (mit Historie, seltenen Badges etc.) ist V3 im Blueprint; das hier ist der
// sichtbare Vorgeschmack darauf.
export type Badge = { icon: string; label: string };

export type BadgeInput = {
  level: number;
  growthPercent: number;
  activityLabel: string;
  currentStreak: number;
  createdAt: Date;
};

export function computeBadges(c: BadgeInput): Badge[] {
  const badges: Badge[] = [];

  if (c.level >= 50) badges.push({ icon: "👑", label: "Metropole-Status" });
  else if (c.level >= 31) badges.push({ icon: "🌆", label: "Großstadt-Status" });

  if (c.activityLabel === "Sehr hoch") badges.push({ icon: "🏆", label: "Top-Aktivität" });

  if (c.currentStreak >= 14) badges.push({ icon: "🔥", label: `${c.currentStreak}-Tage-Streak` });
  else if (c.currentStreak >= 5) badges.push({ icon: "🔥", label: "Aktiver Streak" });

  if (c.growthPercent >= 10) badges.push({ icon: "🚀", label: "Starkes Wachstum" });

  const daysSinceCreation = (Date.now() - c.createdAt.getTime()) / 86_400_000;
  if (daysSinceCreation <= 14) badges.push({ icon: "🐣", label: "Neu auf EselWorld" });

  return badges;
}
