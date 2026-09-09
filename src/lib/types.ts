export type CommunitySummary = {
  id: string;
  slug: string;
  name: string;
  description: string;
  language: string;
  inviteUrl: string;
  iconEmoji: string;
  colorHex: string;
  memberCount: number;
  activityLabel: string;
  growthPercent: number;
  level: number;
  status: "pending" | "approved" | "rejected";
  plotIndex: number | null;
  mapX: number;
  mapY: number;
  tags: string[];
  createdAt: Date;
  xpTotal: number;
  currentStreak: number;
  category: { id: string; name: string; slug: string; icon: string };
  alliance: { id: string; name: string; slug: string; icon: string; colorHex: string } | null;
};

export type CategoryOption = {
  id: string;
  name: string;
  slug: string;
  icon: string;
};

export const SIZE_BUCKETS = [
  { id: "small", label: "Klein (< 300)", test: (n: number) => n < 300 },
  { id: "medium", label: "Mittel (300–1.500)", test: (n: number) => n >= 300 && n <= 1500 },
  { id: "large", label: "Groß (> 1.500)", test: (n: number) => n > 1500 },
] as const;
