import { prisma } from "@/lib/prisma";
import { parseTags } from "@/lib/tags";
import { plotById } from "@/lib/worldMap";
import type { CommunitySummary } from "@/lib/types";
import type { Community, Category, Alliance } from "@prisma/client";

const communityInclude = { category: true, alliance: true } as const;
type CommunityWithRelations = Community & { category: Category; alliance: Alliance | null };

function toSummary(c: CommunityWithRelations): CommunitySummary {
  const plot = c.plotIndex !== null ? plotById(c.plotIndex) : undefined;
  return {
    id: c.id,
    slug: c.slug,
    name: c.name,
    description: c.description,
    language: c.language,
    inviteUrl: c.inviteUrl,
    iconEmoji: c.iconEmoji,
    colorHex: c.colorHex,
    memberCount: c.memberCount,
    activityLabel: c.activityLabel,
    growthPercent: c.growthPercent,
    level: c.level,
    status: c.status,
    plotIndex: c.plotIndex,
    mapX: plot?.x ?? 0,
    mapY: plot?.y ?? 0,
    tags: parseTags(c.tags),
    createdAt: c.createdAt,
    xpTotal: c.xpTotal,
    currentStreak: c.currentStreak,
    category: {
      id: c.category.id,
      name: c.category.name,
      slug: c.category.slug,
      icon: c.category.icon,
    },
    alliance: c.alliance
      ? {
          id: c.alliance.id,
          name: c.alliance.name,
          slug: c.alliance.slug,
          icon: c.alliance.icon,
          colorHex: c.alliance.colorHex,
        }
      : null,
  };
}

export async function getApprovedCommunities(): Promise<CommunitySummary[]> {
  const rows = await prisma.community.findMany({
    where: { status: "approved" },
    include: communityInclude,
    orderBy: { level: "desc" },
  });
  return rows.map(toSummary);
}

export async function getCommunityBySlug(
  slug: string
): Promise<CommunitySummary | null> {
  const row = await prisma.community.findUnique({
    where: { slug },
    include: communityInclude,
  });
  if (!row) return null;
  return toSummary(row);
}

export async function getPendingCommunities(): Promise<CommunitySummary[]> {
  const rows = await prisma.community.findMany({
    where: { status: "pending" },
    include: communityInclude,
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toSummary);
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getApprovedCommunitiesByLand(
  landSlug: string
): Promise<CommunitySummary[]> {
  const rows = await prisma.community.findMany({
    where: { status: "approved", category: { slug: landSlug } },
    include: communityInclude,
    orderBy: { level: "desc" },
  });
  return rows.map(toSummary);
}

export async function getSpotlightCommunity(): Promise<CommunitySummary | null> {
  const row = await prisma.community.findFirst({
    where: { status: "approved" },
    include: communityInclude,
    orderBy: { growthPercent: "desc" },
  });
  return row ? toSummary(row) : null;
}

export async function getWorldStats() {
  const [communityCount, memberAgg] = await Promise.all([
    prisma.community.count({ where: { status: "approved" } }),
    prisma.community.aggregate({
      where: { status: "approved" },
      _sum: { memberCount: true },
    }),
  ]);
  return {
    communityCount,
    memberCount: memberAgg._sum.memberCount ?? 0,
  };
}

export async function getLandCommunityCounts(): Promise<Record<string, number>> {
  const rows = await prisma.community.groupBy({
    by: ["categoryId"],
    where: { status: "approved" },
    _count: { _all: true },
  });
  const categories = await prisma.category.findMany();
  const bySlug: Record<string, number> = {};
  for (const row of rows) {
    const cat = categories.find((c) => c.id === row.categoryId);
    if (cat) bySlug[cat.slug] = row._count._all;
  }
  return bySlug;
}

export async function getCommunitiesByOwner(
  ownerId: string
): Promise<CommunitySummary[]> {
  const rows = await prisma.community.findMany({
    where: { ownerId },
    include: communityInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toSummary);
}

export type OwnedCommunity = CommunitySummary & {
  lastActiveDate: Date | null;
  recentActivity: {
    date: Date;
    xpAwarded: number;
    uniqueActiveMembers: number;
  }[];
};

export async function getOwnedCommunitiesWithActivity(
  ownerId: string
): Promise<OwnedCommunity[]> {
  const rows = await prisma.community.findMany({
    where: { ownerId },
    include: {
      ...communityInclude,
      activityDaily: { orderBy: { date: "desc" }, take: 14 },
    },
    orderBy: { createdAt: "desc" },
  });

  return rows.map((c) => ({
    ...toSummary(c),
    lastActiveDate: c.lastActiveDate,
    recentActivity: c.activityDaily
      .slice()
      .reverse()
      .map((a) => ({
        date: a.date,
        xpAwarded: a.xpAwarded,
        uniqueActiveMembers: a.uniqueActiveMembers,
      })),
  }));
}

export type CommunityDetail = CommunitySummary & {
  lastActiveDate: Date | null;
  recentActivity: { date: Date; xpAwarded: number; uniqueActiveMembers: number }[];
  owner: { username: string; avatarEmoji: string } | null;
  rankGlobal: number;
  rankInLand: number;
  similar: CommunitySummary[];
};

export async function getCommunityDetail(slug: string): Promise<CommunityDetail | null> {
  const row = await prisma.community.findUnique({
    where: { slug },
    include: {
      ...communityInclude,
      owner: true,
      activityDaily: { orderBy: { date: "desc" }, take: 14 },
    },
  });
  if (!row || row.status !== "approved") return null;

  const [rankGlobal, rankInLand, similarRows] = await Promise.all([
    prisma.community.count({
      where: { status: "approved", xpTotal: { gt: row.xpTotal } },
    }),
    prisma.community.count({
      where: { status: "approved", categoryId: row.categoryId, xpTotal: { gt: row.xpTotal } },
    }),
    prisma.community.findMany({
      where: {
        status: "approved",
        categoryId: row.categoryId,
        id: { not: row.id },
      },
      include: communityInclude,
      orderBy: { level: "desc" },
      take: 3,
    }),
  ]);

  return {
    ...toSummary(row),
    lastActiveDate: row.lastActiveDate,
    recentActivity: row.activityDaily
      .slice()
      .reverse()
      .map((a) => ({ date: a.date, xpAwarded: a.xpAwarded, uniqueActiveMembers: a.uniqueActiveMembers })),
    owner: row.owner ? { username: row.owner.username, avatarEmoji: row.owner.avatarEmoji } : null,
    rankGlobal: rankGlobal + 1,
    rankInLand: rankInLand + 1,
    similar: similarRows.map(toSummary),
  };
}

export async function getTopCommunities(options: {
  landSlug?: string;
  limit?: number;
}): Promise<CommunitySummary[]> {
  const rows = await prisma.community.findMany({
    where: {
      status: "approved",
      ...(options.landSlug ? { category: { slug: options.landSlug } } : {}),
    },
    include: communityInclude,
    orderBy: { xpTotal: "desc" },
    take: options.limit ?? 20,
  });
  return rows.map(toSummary);
}

export type AllianceSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  colorHex: string;
  createdAt: Date;
  memberCount: number;
  totalMembers: number;
  avgLevel: number;
  owner: { username: string; avatarEmoji: string };
};

function toAllianceSummary(a: Alliance & { members: Community[]; owner: { username: string; avatarEmoji: string } }): AllianceSummary {
  const approvedMembers = a.members.filter((m) => m.status === "approved");
  const totalMembers = approvedMembers.reduce((sum, m) => sum + m.memberCount, 0);
  const avgLevel = approvedMembers.length
    ? Math.round(approvedMembers.reduce((sum, m) => sum + m.level, 0) / approvedMembers.length)
    : 0;
  return {
    id: a.id,
    name: a.name,
    slug: a.slug,
    description: a.description,
    icon: a.icon,
    colorHex: a.colorHex,
    createdAt: a.createdAt,
    memberCount: approvedMembers.length,
    totalMembers,
    avgLevel,
    owner: a.owner,
  };
}

export async function getAlliances(): Promise<AllianceSummary[]> {
  const rows = await prisma.alliance.findMany({
    include: { members: true, owner: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toAllianceSummary).sort((a, b) => b.totalMembers - a.totalMembers);
}

export async function getAllianceBySlug(
  slug: string
): Promise<(AllianceSummary & { members: CommunitySummary[] }) | null> {
  const row = await prisma.alliance.findUnique({
    where: { slug },
    include: {
      owner: true,
      members: { include: communityInclude },
    },
  });
  if (!row) return null;
  const summary = toAllianceSummary(row);
  const members = row.members
    .filter((m) => m.status === "approved")
    .map((m) => toSummary(m as CommunityWithRelations))
    .sort((a, b) => b.level - a.level);
  return { ...summary, members };
}

export type UserProfile = {
  id: string;
  username: string;
  avatarEmoji: string;
  bio: string | null;
  accentColor: string;
  website: string | null;
  createdAt: Date;
  communities: CommunitySummary[];
  alliancesFounded: { id: string; slug: string; name: string; icon: string; colorHex: string; createdAt: Date }[];
  favorites: CommunitySummary[];
};

export async function getUserProfile(username: string): Promise<UserProfile | null> {
  const row = await prisma.user.findUnique({
    where: { username },
    include: {
      communities: { where: { status: "approved" }, include: communityInclude },
      alliances: true,
      favorites: {
        include: { community: { include: communityInclude } },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!row) return null;

  return {
    id: row.id,
    username: row.username,
    avatarEmoji: row.avatarEmoji,
    bio: row.bio,
    accentColor: row.accentColor,
    website: row.website,
    createdAt: row.createdAt,
    communities: row.communities
      .map((c) => toSummary(c as CommunityWithRelations))
      .sort((a, b) => b.level - a.level),
    alliancesFounded: row.alliances.map((a) => ({
      id: a.id,
      slug: a.slug,
      name: a.name,
      icon: a.icon,
      colorHex: a.colorHex,
      createdAt: a.createdAt,
    })),
    favorites: row.favorites
      .filter((f) => f.community.status === "approved")
      .map((f) => toSummary(f.community as CommunityWithRelations)),
  };
}

export async function getFavoriteCommunityIds(userId: string): Promise<Set<string>> {
  const rows = await prisma.favorite.findMany({ where: { userId }, select: { communityId: true } });
  return new Set(rows.map((r) => r.communityId));
}
