import { NextResponse } from "next/server";
import { getApprovedCommunities } from "@/lib/queries";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const language = searchParams.get("language");

  let communities = await getApprovedCommunities();
  if (category) communities = communities.filter((c) => c.category.slug === category);
  if (language) communities = communities.filter((c) => c.language === language);

  return NextResponse.json({ communities });
}
