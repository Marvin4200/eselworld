import { prisma } from "@/lib/prisma";
import { plotsForLand, PLOTS_PER_LAND } from "@/lib/worldMap";

/**
 * Vergibt einen zufälligen freien Platz innerhalb eines bestimmten Landes
 * (7 Plätze pro Land). Wirft, wenn das Land voll ist — das ist eine bewusste
 * V1-Grenze: ein Land mit 7 Communities ist "voll", bis es (später) eine
 * größere Kartenversion mit mehr Plätzen pro Land gibt.
 */
export async function assignFreePlot(landId: string): Promise<number> {
  const landPlots = plotsForLand(landId);
  const taken = await prisma.community.findMany({
    where: { plotIndex: { in: landPlots.map((p) => p.index) } },
    select: { plotIndex: true },
  });
  const takenSet = new Set(taken.map((t) => t.plotIndex));
  const free = landPlots.filter((p) => !takenSet.has(p.index));

  if (free.length === 0) {
    throw new Error(
      `Alle ${PLOTS_PER_LAND} Plätze in diesem Land sind vergeben. Dieses Land braucht eine größere Karte.`
    );
  }

  return free[Math.floor(Math.random() * free.length)].index;
}
