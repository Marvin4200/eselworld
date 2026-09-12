import { PrismaClient } from "@prisma/client";
import { CATEGORY_COLORS } from "../src/lib/categoryColors";
import { xpForLevel } from "../src/lib/activityFormula";
import { LANDS } from "../src/lib/worldMap";

const daysAgo = (n: number) => new Date(Date.now() - n * 86_400_000);

export async function seedDemoData(prisma: PrismaClient) {
  console.log("Lösche vorhandene Daten…");
  await prisma.activityDaily.deleteMany();
  await prisma.alliance.deleteMany();
  await prisma.community.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("Lege Länder (Kategorien) an…");
  const catMap = new Map<string, string>();
  for (const land of LANDS) {
    const created = await prisma.category.create({
      data: { name: land.name, slug: land.id, icon: land.icon },
    });
    catMap.set(land.id, created.id);
  }

  console.log("Lege Demo-Nutzer an…");
  const david = await prisma.user.create({
    data: {
      discordId: "demo-david",
      username: "David",
      avatarEmoji: "🧑‍💻",
      bio: "Baut EselWorld und hält nebenbei die Eselbande am Laufen.",
      createdAt: daysAgo(410),
    },
  });
  await prisma.user.create({
    data: {
      discordId: "demo-mira",
      username: "Mira",
      avatarEmoji: "🌱",
      bio: "Neu hier, auf der Suche nach der richtigen Community.",
      createdAt: daysAgo(4),
    },
  });

  const catColor = (slug: string) => CATEGORY_COLORS[slug];

  console.log("Lege Communities an…");
  const communities = [
    {
      name: "Eselbande",
      slug: "eselbande",
      discordGuildId: "guild-eselbande",
      description:
        "Die Heimat von EselWorld selbst: eine bunt gemischte Gaming-Community rund um Koop-Runden, Talkabende und gemeinsame Turniere.",
      categorySlug: "gaming-lands",
      language: "Deutsch",
      inviteUrl: "https://discord.gg/eselbande-demo",
      iconEmoji: "🫏",
      memberCount: 3240,
      activityLabel: "Sehr hoch",
      growthPercent: 8,
      level: 34,
      status: "approved" as const,
      plotIndex: 0,
      tags: "Gaming,Community,Deutsch,General Gaming",
      ownerId: david.id,
      createdAt: daysAgo(400),
    },
    {
      name: "Blockwerk",
      slug: "blockwerk",
      discordGuildId: "guild-blockwerk",
      description:
        "Survival-Minecraft-Server mit SMP-Season, eigener Wirtschaft und einer Community, die gemeinsam baut statt gegeneinander.",
      categorySlug: "gaming-lands",
      language: "Deutsch",
      inviteUrl: "https://discord.gg/blockwerk-demo",
      iconEmoji: "⛏️",
      memberCount: 972,
      activityLabel: "Hoch",
      growthPercent: 5,
      level: 19,
      status: "approved" as const,
      plotIndex: 1,
      tags: "Minecraft,Survival,Deutsch",
      createdAt: daysAgo(180),
    },
    {
      name: "English Wanderers",
      slug: "english-wanderers",
      discordGuildId: "guild-wanderers",
      description:
        "A chill, English-speaking gaming community for co-op nights and casual hangouts. Freshly submitted to EselWorld.",
      categorySlug: "gaming-lands",
      language: "Englisch",
      inviteUrl: "https://discord.gg/wanderers-demo",
      iconEmoji: "🧭",
      memberCount: 300,
      activityLabel: "Mittel",
      growthPercent: 6,
      level: 6,
      status: "pending" as const,
      tags: "Gaming,English,Chill",
      createdAt: daysAgo(2),
    },
    {
      name: "KI Werkstatt",
      slug: "ki-werkstatt",
      discordGuildId: "guild-kiwerkstatt",
      description:
        "Deutschsprachiger Austausch über KI-Tools, Prompting und eigene Projekte — von Hobby bis Beruf.",
      categorySlug: "tech-valley",
      language: "Deutsch",
      inviteUrl: "https://discord.gg/kiwerkstatt-demo",
      iconEmoji: "🤖",
      memberCount: 1150,
      activityLabel: "Hoch",
      growthPercent: 15,
      level: 22,
      status: "approved" as const,
      plotIndex: 20,
      tags: "KI,Technologie,Coding",
      createdAt: daysAgo(90),
    },
    {
      name: "Merida Roleplay",
      slug: "merida-roleplay",
      discordGuildId: "guild-merida",
      description:
        "FiveM-Roleplay mit eigener Stadt, aktiver Fraktionsstruktur und wöchentlichen Storylines. Neueinsteiger sind jederzeit willkommen.",
      categorySlug: "roleplay-realm",
      language: "Deutsch",
      inviteUrl: "https://discord.gg/merida-demo",
      iconEmoji: "🏙️",
      memberCount: 1842,
      activityLabel: "Sehr hoch",
      growthPercent: 12,
      level: 27,
      status: "approved" as const,
      plotIndex: 40,
      tags: "FiveM,Roleplay,Deutsch",
      createdAt: daysAgo(250),
    },
    {
      name: "Nachtschicht Beats",
      slug: "nachtschicht-beats",
      discordGuildId: "guild-nachtschicht",
      description:
        "Discord-Radio, Produktions-Feedback und ein Voice-Channel, der selten leer ist. Für alle, die Musik machen oder einfach hören wollen.",
      categorySlug: "music-island",
      language: "Deutsch",
      inviteUrl: "https://discord.gg/nachtschicht-demo",
      iconEmoji: "🎧",
      memberCount: 410,
      activityLabel: "Mittel",
      growthPercent: 3,
      level: 12,
      status: "approved" as const,
      plotIndex: 60,
      tags: "Musik,Produktion,Discord-Radio",
      createdAt: daysAgo(60),
    },
    {
      name: "Turnier Allianz",
      slug: "turnier-allianz",
      discordGuildId: "guild-turnierallianz",
      description:
        "Organisierte Turniere, Scrims und Team-Suche für kompetitive Spieler — von Ligenbetrieb bis Casual-Cup.",
      categorySlug: "esports-arena",
      language: "Deutsch",
      inviteUrl: "https://discord.gg/turnierallianz-demo",
      iconEmoji: "🏆",
      memberCount: 780,
      activityLabel: "Hoch",
      growthPercent: 9,
      level: 18,
      status: "approved" as const,
      plotIndex: 80,
      tags: "Esports,Turniere,Teams",
      createdAt: daysAgo(10),
    },
    {
      name: "Drift Republic",
      slug: "drift-republic",
      discordGuildId: "guild-driftrepublic",
      description:
        "Sim-Racing- und Auto-Community mit gemeinsamen Rennabenden, Setup-Hilfe und einer Prise Bock-auf-PS.",
      categorySlug: "car-district",
      language: "Deutsch",
      inviteUrl: "https://discord.gg/driftrepublic-demo",
      iconEmoji: "🏎️",
      memberCount: 640,
      activityLabel: "Mittel",
      growthPercent: 4,
      level: 15,
      status: "approved" as const,
      plotIndex: 100,
      tags: "Autos,Sim-Racing,Deutsch",
      createdAt: daysAgo(70),
    },
    {
      name: "Pixel Ateliers",
      slug: "pixel-ateliers",
      discordGuildId: "guild-pixel",
      description:
        "Kleine, feine Kreativ-Community für digitale Kunst, Pixelart und Design-Feedback. Neu bei EselWorld eingereicht.",
      categorySlug: "creative-zone",
      language: "Deutsch",
      inviteUrl: "https://discord.gg/pixelateliers-demo",
      iconEmoji: "🎨",
      memberCount: 88,
      activityLabel: "Niedrig",
      growthPercent: 1,
      level: 4,
      status: "pending" as const,
      tags: "Kunst,Design,Kreativität",
      createdAt: daysAgo(3),
    },
    {
      name: "Lachflash",
      slug: "lachflash",
      discordGuildId: "guild-lachflash",
      description:
        "Meme-Dumps, Quatsch-Voice-Runden und die Art von Unterhaltung, die man abends nach der Arbeit braucht.",
      categorySlug: "entertainment",
      language: "Deutsch",
      inviteUrl: "https://discord.gg/lachflash-demo",
      iconEmoji: "😂",
      memberCount: 265,
      activityLabel: "Mittel",
      growthPercent: 2,
      level: 8,
      status: "approved" as const,
      plotIndex: 140,
      tags: "Memes,Unterhaltung",
      createdAt: daysAgo(20),
    },
  ];

  const bySlug = new Map<string, { id: string }>();
  for (const c of communities) {
    const { categorySlug, ownerId, ...rest } = c;
    const created = await prisma.community.create({
      data: {
        ...rest,
        colorHex: catColor(categorySlug),
        xpTotal: xpForLevel(c.level),
        category: { connect: { id: catMap.get(categorySlug)! } },
        ...(ownerId ? { owner: { connect: { id: ownerId } } } : {}),
      },
    });
    bySlug.set(c.slug, created);
  }

  console.log("Lege Bündnisse an…");
  await prisma.alliance.create({
    data: {
      name: "Nordbund",
      slug: "nordbund",
      description:
        "Ein Bündnis aus etablierten, deutschsprachigen Communities über Landesgrenzen hinweg — gemeinsam wachsen statt gegeneinander.",
      icon: "🛡️",
      colorHex: "#3fd6c8",
      owner: { connect: { id: david.id } },
      members: {
        connect: [{ id: bySlug.get("eselbande")!.id }, { id: bySlug.get("merida-roleplay")!.id }],
      },
    },
  });
  await prisma.alliance.create({
    data: {
      name: "Kreativkollektiv",
      slug: "kreativkollektiv",
      description: "KI, Musik und Technologie querbeet — Communities, die gerne über den Tellerrand schauen.",
      icon: "🎨",
      colorHex: "#e0577a",
      owner: { connect: { id: david.id } },
      members: {
        connect: [{ id: bySlug.get("ki-werkstatt")!.id }, { id: bySlug.get("nachtschicht-beats")!.id }],
      },
    },
  });

  console.log(`Fertig: ${LANDS.length} Länder, ${communities.length} Communities, 2 Bündnisse.`);
}

// Nur ausführen, wenn direkt per CLI gestartet (z. B. "npm run db:seed") —
// nicht, wenn seedDemoData() aus seed-if-empty.ts importiert wird.
if (require.main === module) {
  const prisma = new PrismaClient();
  seedDemoData(prisma)
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
