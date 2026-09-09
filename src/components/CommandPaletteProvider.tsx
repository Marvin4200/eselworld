import CommandPalette, { type PaletteEntry } from "@/components/CommandPalette";
import { getApprovedCommunities, getAlliances } from "@/lib/queries";
import { LANDS } from "@/lib/worldMap";

export default async function CommandPaletteProvider() {
  const [communities, alliances] = await Promise.all([getApprovedCommunities(), getAlliances()]);

  const entries: PaletteEntry[] = [
    ...LANDS.map((l): PaletteEntry => ({
      id: `land-${l.id}`,
      title: l.name,
      subtitle: l.subtitle,
      icon: l.icon,
      href: `/land/${l.id}`,
      kind: "land",
    })),
    ...communities.map((c): PaletteEntry => ({
      id: `c-${c.id}`,
      title: c.name,
      subtitle: `${c.category.icon} ${c.category.name} · Lv. ${c.level}`,
      icon: c.iconEmoji,
      href: `/community/${c.slug}`,
      kind: "community",
    })),
    ...alliances.map((a): PaletteEntry => ({
      id: `a-${a.id}`,
      title: a.name,
      subtitle: `Bündnis · ${a.memberCount} Communities`,
      icon: a.icon,
      href: `/alliance/${a.slug}`,
      kind: "alliance",
    })),
  ];

  return <CommandPalette entries={entries} />;
}
