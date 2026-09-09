import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line-soft mt-24">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-8 text-sm text-ink-faint sm:flex-row sm:items-center sm:justify-between">
        <p>🫏 EselWorld — Kleine Communities. Große Geschichten.</p>
        <div className="flex flex-wrap gap-5">
          <Link href="/ranking" className="hover:text-ink">
            Ranking
          </Link>
          <Link href="/alliances" className="hover:text-ink">
            Bündnisse
          </Link>
          <Link href="/about" className="hover:text-ink">
            Über
          </Link>
          <Link href="/legal" className="hover:text-ink">
            Impressum &amp; Datenschutz
          </Link>
        </div>
      </div>
    </footer>
  );
}
