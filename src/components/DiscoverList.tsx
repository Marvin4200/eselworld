"use client";

import { useMemo, useState } from "react";
import type { CategoryOption, CommunitySummary } from "@/lib/types";
import { SIZE_BUCKETS } from "@/lib/types";
import CommunityCard from "@/components/CommunityCard";

type Props = {
  communities: CommunitySummary[];
  categories: CategoryOption[];
  initialCategory?: string;
};

export default function DiscoverList({ communities, categories, initialCategory }: Props) {
  const [search, setSearch] = useState("");
  const [land, setLand] = useState(initialCategory ?? "all");
  const [language, setLanguage] = useState("all");
  const [size, setSize] = useState("all");
  const [allianceOnly, setAllianceOnly] = useState(false);
  const [sort, setSort] = useState<"level" | "growth" | "members" | "new">("level");

  const languages = useMemo(
    () => Array.from(new Set(communities.map((c) => c.language))).sort(),
    [communities]
  );

  const trending = useMemo(
    () => [...communities].sort((a, b) => b.growthPercent - a.growthPercent).slice(0, 3),
    [communities]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = communities.filter((c) => {
      if (
        q &&
        !c.name.toLowerCase().includes(q) &&
        !c.tags.some((t) => t.toLowerCase().includes(q))
      )
        return false;
      if (land !== "all" && c.category.slug !== land) return false;
      if (language !== "all" && c.language !== language) return false;
      if (allianceOnly && !c.alliance) return false;
      if (size !== "all") {
        const bucket = SIZE_BUCKETS.find((b) => b.id === size);
        if (bucket && !bucket.test(c.memberCount)) return false;
      }
      return true;
    });
    const sorted = [...list];
    if (sort === "level") sorted.sort((a, b) => b.level - a.level);
    if (sort === "growth") sorted.sort((a, b) => b.growthPercent - a.growthPercent);
    if (sort === "members") sorted.sort((a, b) => b.memberCount - a.memberCount);
    if (sort === "new") sorted.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return sorted;
  }, [communities, search, land, language, size, allianceOnly, sort]);

  const noFiltersActive =
    !search && land === "all" && language === "all" && size === "all" && !allianceOnly;

  return (
    <div>
      {noFiltersActive && trending.length > 0 && (
        <div className="mb-6">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            🚀 Am schnellsten wachsend
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {trending.map((c) => (
              <CommunityCard key={c.id} c={c} />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-line bg-bg-raised p-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          placeholder="Community oder Tag suchen…"
          className="w-full rounded-full border border-line bg-bg px-4 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-teal"
        />

        <div className="mt-3 flex flex-wrap gap-1.5">
          <button
            onClick={() => setLand("all")}
            className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
              land === "all"
                ? "border-ink bg-ink text-bg"
                : "border-line text-ink-soft hover:border-teal"
            }`}
          >
            Alle Länder
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setLand(c.slug)}
              className={`rounded-full border px-2.5 py-1 text-xs font-medium transition ${
                land === c.slug
                  ? "border-ink bg-ink text-bg"
                  : "border-line text-ink-soft hover:border-teal"
              }`}
            >
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink-soft outline-none focus:border-teal"
          >
            <option value="all">Alle Sprachen</option>
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            className="rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink-soft outline-none focus:border-teal"
          >
            <option value="all">Jede Größe</option>
            {SIZE_BUCKETS.map((b) => (
              <option key={b.id} value={b.id}>
                {b.label}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink-soft outline-none focus:border-teal"
          >
            <option value="level">Sortierung: Level</option>
            <option value="growth">Sortierung: Wachstum</option>
            <option value="members">Sortierung: Mitglieder</option>
            <option value="new">Sortierung: Neueste</option>
          </select>
          <label className="flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={allianceOnly}
              onChange={(e) => setAllianceOnly(e.target.checked)}
              className="accent-teal"
            />
            🤝 Nur Bündnisse
          </label>
        </div>
      </div>

      <p className="mt-4 text-sm text-ink-faint">
        {filtered.length} {filtered.length === 1 ? "Community" : "Communities"} gefunden
      </p>

      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-bg-raised p-10 text-center text-ink-faint">
          Keine Community passt zu diesen Filtern. Versuch es mit weniger Einschränkungen.
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CommunityCard key={c.id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
