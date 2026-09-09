import type { Badge } from "@/lib/badges";

export type UserBadgeInput = {
  createdAt: Date;
  communityCount: number;
  landCount: number;
  topLevel: number;
  allianceFoundedCount: number;
};

export function computeUserBadges(u: UserBadgeInput): Badge[] {
  const badges: Badge[] = [];

  const daysSinceJoin = (Date.now() - u.createdAt.getTime()) / 86_400_000;
  if (daysSinceJoin >= 365) badges.push({ icon: "🕰️", label: "Urgestein" });
  else if (daysSinceJoin <= 14) badges.push({ icon: "🌱", label: "Neuling" });

  if (u.communityCount >= 1) badges.push({ icon: "🏗️", label: "Stadtgründer" });
  if (u.communityCount >= 3) badges.push({ icon: "👑", label: "Sammler" });

  if (u.landCount >= 2) badges.push({ icon: "🌍", label: "Multi-Land" });

  if (u.topLevel >= 51) badges.push({ icon: "🏰", label: "Metropolen-Baumeister" });
  else if (u.topLevel >= 31) badges.push({ icon: "🌆", label: "Großstadt-Baumeister" });

  if (u.allianceFoundedCount >= 1) badges.push({ icon: "🤝", label: "Diplomat" });

  return badges;
}
