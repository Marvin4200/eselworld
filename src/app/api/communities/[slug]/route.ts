import { NextResponse } from "next/server";
import { getCommunityBySlug } from "@/lib/queries";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const community = await getCommunityBySlug(slug);
  if (!community || community.status !== "approved") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ community });
}
