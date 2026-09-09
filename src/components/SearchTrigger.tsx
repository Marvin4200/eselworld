"use client";

export default function SearchTrigger({
  className,
  placeholder = "Community, Land oder Bündnis suchen…",
}: {
  className?: string;
  placeholder?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
      className={className}
    >
      <span aria-hidden>🔍</span>
      <span className="flex-1 truncate text-left">{placeholder}</span>
      <kbd className="rounded border border-current/20 px-1.5 py-0.5 text-[10px] opacity-70">
        Ctrl K
      </kbd>
    </button>
  );
}
