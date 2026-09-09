import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import SearchTrigger from "@/components/SearchTrigger";

const NAV = [
  { href: "/", label: "Karte", match: (p: string) => p === "/" || p.startsWith("/land") },
  { href: "/discover", label: "Entdecken" },
  { href: "/alliances", label: "Bündnisse" },
  { href: "/ranking", label: "Ranking" },
  { href: "/about", label: "Über" },
];

export default async function MapHeader({ active = "Karte" }: { active?: string }) {
  const user = await getCurrentUser();

  return (
    <header className="relative z-40 flex items-center gap-4 border-b border-white/10 bg-[#0a0e1a]/95 px-5 py-3 backdrop-blur">
      <Link href="/" className="flex items-center gap-2.5 shrink-0">
        <span className="text-3xl leading-none">🫏</span>
        <span className="leading-tight">
          <span className="block font-display text-lg font-bold tracking-wide">
            <span className="text-white">ESEL</span>
            <span className="text-[#3fd6c8]">WORLD</span>
          </span>
          <span className="block text-[11px] text-[#6b7396]">
            Entdecke deine nächste Community.
          </span>
        </span>
      </Link>

      <nav className="ml-2 hidden items-center gap-1 text-sm md:flex">
        {NAV.map((item) => {
          const isActive = item.label === active;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-3 py-1.5 transition ${
                isActive
                  ? "text-[#3fd6c8]"
                  : "text-[#aab2d1] hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/dashboard"
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
            active === "Mein Profil" ? "text-[#3fd6c8]" : "text-[#aab2d1] hover:text-white"
          }`}
        >
          {user && <span>{user.avatarEmoji}</span>}
          Mein Profil
        </Link>
      </nav>

      <SearchTrigger
        className="ml-auto hidden max-w-md flex-1 items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#aab2d1] transition hover:border-[#3fd6c8]/60 sm:flex"
        placeholder="Community, Land oder Bündnis suchen…"
      />
    </header>
  );
}
