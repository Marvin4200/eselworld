// Implementiert das Aktivitäts- und Level-System aus dem EselWorld-Blueprint
// (Abschnitt 06): Vielfalt an aktiven Mitgliedern zählt mehr als reine
// Nachrichtenmasse, Level wachsen überproportional. Reine, ungetestete
// Konstanten — siehe Blueprint-Hinweis "diese Formel ist ein Startpunkt".

/** Nachrichtenpunkte eines einzelnen Mitglieds an einem Tag, gedeckelt. */
export function messagePoints(messageCount: number): number {
  return Math.min(Math.log2(messageCount + 1), 5);
}

/** Voice-Punkte eines einzelnen Mitglieds an einem Tag, gedeckelt. */
export function voicePoints(minutesWithOthers: number): number {
  return Math.min(minutesWithOthers / 10, 8);
}

export type DailyInput = {
  /** Punkte einzelner aktiver Mitglieder (bereits gedeckelt, vor Community-Boni). */
  memberPoints: number[];
  /** Wöchentliches Mitgliederwachstum als Anteil, z. B. 0.12 für +12 %. */
  growthRate: number;
  currentStreak: number;
};

export type DailyResult = {
  uniqueActiveMembers: number;
  basePoints: number;
  breadthBonus: number;
  growthBonus: number;
  streakMultiplier: number;
  xpAwarded: number;
};

const BREADTH_BONUS_PER_MEMBER = 0.3;
const MAX_GROWTH_BONUS_RATE = 0.1;
const STREAK_BONUS_PER_DAY = 0.01;
const MAX_STREAK_BONUS = 0.2;

export function computeDailyActivity(input: DailyInput): DailyResult {
  const uniqueActiveMembers = input.memberPoints.length;
  const basePoints = input.memberPoints.reduce((sum, p) => sum + p, 0);
  const breadthBonus = uniqueActiveMembers * BREADTH_BONUS_PER_MEMBER;
  const growthBonus = basePoints * Math.min(Math.max(input.growthRate, 0), MAX_GROWTH_BONUS_RATE);
  const streakMultiplier = 1 + Math.min(input.currentStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);
  const dailyPoints = basePoints + breadthBonus + growthBonus;

  return {
    uniqueActiveMembers,
    basePoints,
    breadthBonus,
    growthBonus,
    streakMultiplier,
    xpAwarded: dailyPoints * streakMultiplier,
  };
}

/** XP, die nötig ist, um von Level `n` auf `n + 1` zu kommen. */
export function levelUpCost(level: number): number {
  return 500 * Math.pow(level, 1.6);
}

/** Kumulierte XP, die für das Erreichen von `level` mindestens nötig ist. */
export function xpForLevel(level: number): number {
  let total = 0;
  for (let n = 1; n < level; n++) total += levelUpCost(n);
  return total;
}

/** Level + Fortschritt zum nächsten Level für eine gegebene Gesamt-XP. */
export function levelProgress(xpTotal: number): {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
} {
  let level = 1;
  let remaining = Math.max(xpTotal, 0);
  // Kleine Toleranz gegen Fließkomma-Drift: xpForLevel() summiert vorwärts,
  // dieser Loop zieht ab — bei vielen Levels können beide sonst um Bruchteile
  // auseinanderlaufen und knapp am Levelgrenzwert falsch runden.
  while (remaining >= levelUpCost(level) * (1 - 1e-9) && level < 999) {
    remaining = Math.max(0, remaining - levelUpCost(level));
    level++;
  }
  return { level, xpIntoLevel: remaining, xpForNextLevel: levelUpCost(level) };
}

/** Aktivitäts-Label aus dem Punkteschnitt pro aktivem Mitglied ableiten. */
export function activityLabelFromAverage(avgPointsPerMember: number): string {
  if (avgPointsPerMember >= 9) return "Sehr hoch";
  if (avgPointsPerMember >= 5) return "Hoch";
  if (avgPointsPerMember >= 2) return "Mittel";
  return "Niedrig";
}
