import { LANDS } from "@/lib/worldMap";

// Marker-/Akzentfarbe je Land — abgeleitet aus dem Land-Theme in
// worldMap.ts, damit Community-Marker zur Farbwelt ihres Landes passen.
// Wird beim Anlegen einer Community direkt in Community.colorHex kopiert.
export const CATEGORY_COLORS: Record<string, string> = Object.fromEntries(
  LANDS.map((l) => [l.id, l.theme.accent])
);

export const DEFAULT_CATEGORY_COLOR = "#4B5468";
