import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🎲 Überrasch-mich-Feature: springt zu einer zufälligen freigeschalteten Stadt.
export async function GET(request: Request) {
  const communities = await prisma.community.findMany({
    where: { status: "approved" },
    select: { slug: true },
  });
  if (communities.length === 0) {
    return NextResponse.redirect(new URL("/discover", request.url));
  }
  const pick = communities[Math.floor(Math.random() * communities.length)];
  return NextResponse.redirect(new URL(`/community/${pick.slug}`, request.url));
}
