import { prisma } from "@/lib/prisma";
import {
  activityLabelFromAverage,
  computeDailyActivity,
  levelProgress,
  messagePoints,
  voicePoints,
} from "@/lib/activityFormula";

// Solange kein echter Discord-Bot angeschlossen ist, erzeugt diese Funktion
// einen plausiblen Aktivitätstag aus der Mitgliederzahl der Community.
// Der spätere Bot ersetzt nur diese eine Funktion — computeDailyActivity()
// und alles danach bleibt unverändert (siehe README, Abschnitt "Von hier zu V2").
function simulateMemberPoints(memberCount: number): number[] {
  const participationRate = 0.05 + Math.random() * 0.3; // 5–35 % Tagesaktivität
  const activeCount = Math.max(1, Math.round(memberCount * participationRate));

  const points: number[] = [];
  for (let i = 0; i < activeCount; i++) {
    const messages = Math.round(Math.random() * Math.random() * 40); // rechtsschiefe Verteilung
    const hasVoice = Math.random() < 0.4;
    const voiceMinutes = hasVoice ? Math.round(Math.random() * 90) : 0;
    points.push(messagePoints(messages) + voicePoints(voiceMinutes));
  }
  return points;
}

export async function simulateActivityDay(communityId: string) {
  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community || community.status !== "approved") {
    throw new Error("Community nicht gefunden oder nicht freigeschaltet.");
  }

  const memberPoints = simulateMemberPoints(community.memberCount);
  const result = computeDailyActivity({
    memberPoints,
    growthRate: community.growthPercent / 100,
    currentStreak: community.currentStreak,
  });

  const nextDate = new Date(
    (community.lastActiveDate ?? new Date(Date.now() - 86400000)).getTime() + 86400000
  );

  const newXpTotal = community.xpTotal + result.xpAwarded;
  const { level } = levelProgress(newXpTotal);
  const avgPerMember = result.basePoints / Math.max(result.uniqueActiveMembers, 1);

  await prisma.$transaction([
    prisma.activityDaily.create({
      data: {
        communityId: community.id,
        date: nextDate,
        uniqueActiveMembers: result.uniqueActiveMembers,
        basePoints: result.basePoints,
        breadthBonus: result.breadthBonus,
        growthBonus: result.growthBonus,
        streakMultiplier: result.streakMultiplier,
        xpAwarded: result.xpAwarded,
      },
    }),
    prisma.community.update({
      where: { id: community.id },
      data: {
        xpTotal: newXpTotal,
        level,
        currentStreak: community.currentStreak + 1,
        lastActiveDate: nextDate,
        activityLabel: activityLabelFromAverage(avgPerMember),
      },
    }),
  ]);

  return result;
}
