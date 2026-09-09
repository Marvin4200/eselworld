export type CityTier = {
  name: string;
  emoji: string;
  minLevel: number;
  maxLevel: number;
  /** relative marker scale on the map, 1 = base size */
  scale: number;
};

export const CITY_TIERS: CityTier[] = [
  { name: "Kleines Lager", emoji: "🏕️", minLevel: 1, maxLevel: 5, scale: 0.7 },
  { name: "Dorf", emoji: "🏘️", minLevel: 6, maxLevel: 15, scale: 0.85 },
  { name: "Stadt", emoji: "🏙️", minLevel: 16, maxLevel: 30, scale: 1 },
  { name: "Großstadt", emoji: "🌆", minLevel: 31, maxLevel: 50, scale: 1.2 },
  { name: "Metropole", emoji: "🏰", minLevel: 51, maxLevel: Infinity, scale: 1.4 },
];

export function tierForLevel(level: number): CityTier {
  return (
    CITY_TIERS.find((t) => level >= t.minLevel && level <= t.maxLevel) ??
    CITY_TIERS[0]
  );
}
