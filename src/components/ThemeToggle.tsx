"use client";

// Bewusst zustandslos: keine useState/useEffect nötig. Die Sichtbarkeit der
// beiden Icons wird rein über CSS anhand von [data-theme] gesteuert (siehe
// globals.css), das Klick-Handler liest/schreibt data-theme + localStorage
// direkt — kein Hydration-Mismatch, kein setState-in-Effect.
export default function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const current = root.getAttribute("data-theme") ?? (prefersDark ? "dark" : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      window.localStorage.setItem("eselworld-theme", next);
    } catch {
      // localStorage nicht verfügbar (z. B. privater Modus) — Theme gilt nur für diese Seitenladung.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Design wechseln"
      title="Design wechseln"
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-ink-soft transition hover:border-teal hover:text-ink"
    >
      <span className="theme-icon-to-dark">🌙</span>
      <span className="theme-icon-to-light">☀️</span>
    </button>
  );
}
