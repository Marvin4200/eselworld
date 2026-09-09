import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import SearchTrigger from "@/components/SearchTrigger";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Karte" },
  { href: "/discover", label: "Entdecken" },
  { href: "/alliances", label: "Bündnisse" },
  { href: "/ranking", label: "Ranking" },
  { href: "/about", label: "Über" },
];

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft/80 bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display text-xl font-semibold text-ink">
            🫏 EselWorld
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-1.5 text-ink-soft transition hover:bg-bg-sunken hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-ink-soft transition hover:bg-bg-sunken hover:text-ink"
          >
            {user && <span>{user.avatarEmoji}</span>}
            Mein Profil
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <SearchTrigger
            className="hidden items-center gap-2 rounded-full border border-line bg-bg-raised px-3 py-1.5 text-sm text-ink-faint transition hover:border-teal lg:flex lg:w-52"
            placeholder="Suchen…"
          />
          <ThemeToggle />
        </div>
      </div>
      <nav className="flex md:hidden items-center gap-1 overflow-x-auto px-5 pb-3 text-sm">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="shrink-0 rounded-full px-3 py-1.5 text-ink-soft hover:bg-bg-sunken hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/dashboard"
          className="shrink-0 rounded-full px-3 py-1.5 text-ink-soft hover:bg-bg-sunken hover:text-ink"
        >
          Mein Profil
        </Link>
      </nav>
    </header>
  );
}
