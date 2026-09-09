"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type PaletteEntry = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  href: string;
  kind: "community" | "land" | "alliance" | "page";
};

const STATIC_PAGES: PaletteEntry[] = [
  { id: "p-map", title: "Weltkarte", subtitle: "Zur großen Übersicht", icon: "🌍", href: "/", kind: "page" },
  { id: "p-discover", title: "Entdecken", subtitle: "Suchen & filtern", icon: "🔎", href: "/discover", kind: "page" },
  { id: "p-ranking", title: "Ranking", subtitle: "Wer wächst am schnellsten?", icon: "🏆", href: "/ranking", kind: "page" },
  { id: "p-alliances", title: "Bündnisse", subtitle: "Gemeinsam stärker", icon: "🤝", href: "/alliances", kind: "page" },
];

export default function CommandPalette({ entries }: { entries: PaletteEntry[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const all = useMemo(() => [...STATIC_PAGES, ...entries], [entries]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all.slice(0, 8);
    return all
      .filter((e) => e.title.toLowerCase().includes(q) || e.subtitle.toLowerCase().includes(q))
      .slice(0, 8);
  }, [all, query]);

  function openPalette() {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => {
          if (o) return false;
          openPalette();
          return true;
        });
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("open-command-palette", openPalette);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("open-command-palette", openPalette);
    };
  }, []);

  // Reine DOM-Nebenwirkungen (Fokus, Scroll-Sperre) — kein React-State hier,
  // die eigentliche State-Zurücksetzung passiert in openPalette() direkt im
  // auslösenden Event-Handler statt reaktiv in einem Effect.
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function go(entry: PaletteEntry) {
    setOpen(false);
    router.push(entry.href);
  }

  function onQueryChange(value: string) {
    setQuery(value);
    setActiveIndex(0);
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.keyCode === 13) {
      e.preventDefault();
      const chosen = results[activeIndex];
      if (chosen) go(chosen);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 p-4 pt-[12vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Schnellsuche"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-line bg-bg-raised shadow-2xl"
      >
        <div className="flex items-center gap-2 border-b border-line-soft px-4 py-3">
          <span aria-hidden>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Community, Land oder Bündnis suchen…"
            className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <kbd className="rounded border border-line px-1.5 py-0.5 text-[10px] text-ink-faint">
            Esc
          </kbd>
        </div>

        {results.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-ink-faint">
            Nichts gefunden. Versuch&apos;s mit einem anderen Begriff.
          </p>
        ) : (
          <ul className="max-h-96 overflow-y-auto p-2">
            {results.map((entry, i) => (
              <li key={entry.id}>
                <button
                  onClick={() => go(entry)}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    i === activeIndex ? "bg-teal-soft" : "hover:bg-bg-sunken"
                  }`}
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-bg-sunken text-base">
                    {entry.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-ink">
                      {entry.title}
                    </span>
                    <span className="block truncate text-xs text-ink-faint">
                      {entry.subtitle}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
