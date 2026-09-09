"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, SESSION_COOKIE } from "@/lib/session";
import { slugify } from "@/lib/slugify";
import { assignFreePlot } from "@/lib/assignPlot";
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from "@/lib/categoryColors";
import { xpForLevel } from "@/lib/activityFormula";
import { simulateActivityDay } from "@/lib/simulateActivity";

export async function loginAsAction(formData: FormData) {
  const userId = String(formData.get("userId") ?? "");
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return;
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/dashboard");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/");
}

export type SubmitState = { error?: string; success?: boolean };

export async function submitCommunityAction(
  _prev: SubmitState,
  formData: FormData
): Promise<SubmitState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Bitte melde dich zuerst mit Discord an." };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = String(formData.get("categoryId") ?? "");
  const language = String(formData.get("language") ?? "").trim();
  const inviteUrl = String(formData.get("inviteUrl") ?? "").trim();
  const iconEmoji = String(formData.get("iconEmoji") ?? "🏕️").trim();
  const memberCount = Number(formData.get("memberCount") ?? 0);
  const tagsRaw = String(formData.get("tags") ?? "");

  if (!name || name.length < 3)
    return { error: "Bitte gib einen Community-Namen mit mindestens 3 Zeichen an." };
  if (!description || description.length < 20)
    return { error: "Die Beschreibung sollte mindestens 20 Zeichen lang sein." };
  if (!categoryId) return { error: "Bitte wähle eine Kategorie." };
  if (!language) return { error: "Bitte gib eine Sprache an." };
  if (!/^https:\/\/discord\.gg\/.+/.test(inviteUrl))
    return { error: "Bitte gib einen gültigen Discord-Invite an (https://discord.gg/…)." };
  if (!Number.isFinite(memberCount) || memberCount < 0)
    return { error: "Mitgliederzahl ist ungültig." };

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) return { error: "Ungültige Kategorie." };

  let slug = slugify(name);
  if (!slug) slug = `community-${Date.now()}`;
  const existing = await prisma.community.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  await prisma.community.create({
    data: {
      name,
      slug,
      description,
      language,
      inviteUrl,
      iconEmoji: iconEmoji || "🏕️",
      colorHex: CATEGORY_COLORS[category.slug] ?? DEFAULT_CATEGORY_COLOR,
      memberCount: Math.round(memberCount),
      activityLabel: "Unbekannt",
      growthPercent: 0,
      level: 1,
      status: "pending",
      // plotIndex wird erst bei Freischaltung vergeben (approveCommunityAction) —
      // so verbrauchen abgelehnte Einreichungen keinen der 50 Kartenplätze.
      tags: tagsRaw
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
        .join(","),
      discordGuildId: `submitted-${slug}-${Date.now()}`,
      category: { connect: { id: category.id } },
      owner: { connect: { id: user.id } },
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin");
  return { success: true };
}

const ACTIVITY_LABELS = ["Niedrig", "Mittel", "Hoch", "Sehr hoch"];

export async function approveCommunityAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const level = Math.max(1, Number(formData.get("level") ?? 1));
  const activityLabel = String(formData.get("activityLabel") ?? "Mittel");
  const growthPercent = Math.max(0, Number(formData.get("growthPercent") ?? 0));
  if (!id) return;

  const community = await prisma.community.findUnique({
    where: { id },
    include: { category: true },
  });
  if (!community) return;

  const startLevel = Number.isFinite(level) ? level : 1;
  const plotIndex = await assignFreePlot(community.category.slug);

  await prisma.community.update({
    where: { id },
    data: {
      status: "approved",
      level: startLevel,
      // Admin-Schätzung wird zur Start-XP — ab jetzt übernimmt das
      // Aktivitätssystem (simulateActivityDay, später der Bot) das Wachstum.
      xpTotal: xpForLevel(startLevel),
      activityLabel: ACTIVITY_LABELS.includes(activityLabel) ? activityLabel : "Mittel",
      growthPercent: Number.isFinite(growthPercent) ? growthPercent : 0,
      plotIndex,
      reviewedAt: new Date(),
    },
  });

  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/discover");
  revalidatePath(`/land/${community.category.slug}`);
}

export async function rejectCommunityAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const notes = String(formData.get("notes") ?? "");
  if (!id) return;

  await prisma.community.update({
    where: { id },
    data: { status: "rejected", reviewedAt: new Date(), reviewNotes: notes || null },
  });

  revalidatePath("/admin");
}

export async function simulateActivityDayAction(formData: FormData) {
  const communityId = String(formData.get("communityId") ?? "");
  const user = await getCurrentUser();
  if (!user || !communityId) return;

  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community || community.ownerId !== user.id) return;

  await simulateActivityDay(communityId);
  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath("/discover");
  revalidatePath(`/community/${community.slug}`);
}

export type AllianceFormState = { error?: string; success?: boolean; slug?: string };

export async function createAllianceAction(
  _prev: AllianceFormState,
  formData: FormData
): Promise<AllianceFormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Bitte melde dich zuerst mit Discord an." };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const icon = String(formData.get("icon") ?? "🤝").trim();
  const foundingCommunityId = String(formData.get("foundingCommunityId") ?? "");

  if (!name || name.length < 3)
    return { error: "Bitte gib einen Bündnis-Namen mit mindestens 3 Zeichen an." };
  if (!description || description.length < 10)
    return { error: "Bitte beschreib kurz, wofür das Bündnis steht." };

  const foundingCommunity = await prisma.community.findUnique({
    where: { id: foundingCommunityId },
  });
  if (!foundingCommunity || foundingCommunity.ownerId !== user.id || foundingCommunity.status !== "approved") {
    return { error: "Du brauchst eine freigeschaltete eigene Community, um ein Bündnis zu gründen." };
  }
  if (foundingCommunity.allianceId) {
    return { error: "Diese Community ist bereits Mitglied eines Bündnisses." };
  }

  let slug = slugify(name);
  if (!slug) slug = `buendnis-${Date.now()}`;
  const existing = await prisma.alliance.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  await prisma.alliance.create({
    data: {
      name,
      slug,
      description,
      icon: icon || "🤝",
      colorHex: foundingCommunity.colorHex,
      owner: { connect: { id: user.id } },
      members: { connect: { id: foundingCommunity.id } },
    },
  });

  revalidatePath("/alliances");
  revalidatePath("/dashboard");
  return { success: true, slug };
}

export async function joinAllianceAction(formData: FormData) {
  const user = await getCurrentUser();
  const communityId = String(formData.get("communityId") ?? "");
  const allianceId = String(formData.get("allianceId") ?? "");
  if (!user || !communityId || !allianceId) return;

  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community || community.ownerId !== user.id || community.status !== "approved") return;
  if (community.allianceId) return;

  await prisma.community.update({ where: { id: communityId }, data: { allianceId } });

  const alliance = await prisma.alliance.findUnique({ where: { id: allianceId } });
  revalidatePath("/dashboard");
  revalidatePath("/alliances");
  if (alliance) revalidatePath(`/alliance/${alliance.slug}`);
}

export async function leaveAllianceAction(formData: FormData) {
  const user = await getCurrentUser();
  const communityId = String(formData.get("communityId") ?? "");
  if (!user || !communityId) return;

  const community = await prisma.community.findUnique({ where: { id: communityId } });
  if (!community || community.ownerId !== user.id) return;

  await prisma.community.update({ where: { id: communityId }, data: { allianceId: null } });

  revalidatePath("/dashboard");
  revalidatePath("/alliances");
}

export type ProfileFormState = { error?: string };

export async function updateProfileAction(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Bitte melde dich zuerst an." };

  const username = String(formData.get("username") ?? "").trim();
  const avatarEmoji = String(formData.get("avatarEmoji") ?? "").trim();
  const bio = String(formData.get("bio") ?? "").trim();
  const accentColor = String(formData.get("accentColor") ?? "#1F7A6C").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (username.length < 2 || username.length > 24)
    return { error: "Der Nutzername muss zwischen 2 und 24 Zeichen lang sein." };
  if (!avatarEmoji) return { error: "Bitte wähle ein Avatar-Symbol." };
  if (bio.length > 200) return { error: "Die Bio darf maximal 200 Zeichen lang sein." };
  if (!/^#[0-9a-fA-F]{6}$/.test(accentColor))
    return { error: "Ungültige Akzentfarbe." };
  if (website && !/^https?:\/\/.+\..+/.test(website))
    return { error: "Bitte gib eine gültige Website-URL an (mit https://) oder lass das Feld leer." };

  if (username !== user.username) {
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing) return { error: "Dieser Nutzername ist schon vergeben." };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { username, avatarEmoji, bio: bio || null, accentColor, website: website || null },
  });

  revalidatePath("/dashboard");
  revalidatePath(`/u/${user.username}`);
  if (username !== user.username) revalidatePath(`/u/${username}`);
  redirect(`/u/${username}`);
}

export async function toggleFavoriteAction(formData: FormData) {
  const user = await getCurrentUser();
  const communityId = String(formData.get("communityId") ?? "");
  const communitySlug = String(formData.get("communitySlug") ?? "");
  if (!user || !communityId) return;

  const existing = await prisma.favorite.findUnique({
    where: { userId_communityId: { userId: user.id, communityId } },
  });

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
  } else {
    await prisma.favorite.create({ data: { userId: user.id, communityId } });
  }

  if (communitySlug) revalidatePath(`/community/${communitySlug}`);
  revalidatePath(`/u/${user.username}`);
  revalidatePath("/discover");
}
