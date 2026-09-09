import { NextResponse } from "next/server";
import { getApprovedCommunities } from "@/lib/queries";

// Schlanke Projektion für das Kartenrendering (Position, Level, Kategorie).
export async function GET() {
  const communities = await getApprovedCommunities();
  const points = communities.map((c) => ({
    slug: c.slug,
    name: c.name,
    level: c.level,
    mapX: c.mapX,
    mapY: c.mapY,
    colorHex: c.colorHex,
    iconEmoji: c.iconEmoji,
    category: c.category.slug,
  }));
  return NextResponse.json({ points });
}
