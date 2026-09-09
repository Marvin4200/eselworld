import DiscoverList from "@/components/DiscoverList";
import { getApprovedCommunities, getCategories } from "@/lib/queries";

export const metadata = { title: "Entdecken" };

export default async function DiscoverPage() {
  const [communities, categories] = await Promise.all([
    getApprovedCommunities(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
            Entdecken
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Finde deine Leute
          </h1>
          <p className="mt-2 text-ink-soft">
            Die schnelle Alternative zur Karte: tippen, filtern, beitreten.
            Praktisch für unterwegs oder wenn du genau weißt, wonach du
            suchst.
          </p>
        </div>
        <a
          href="/api/random"
          className="shrink-0 rounded-full border border-line bg-bg-raised px-4 py-2 text-sm font-medium text-ink transition hover:border-teal"
        >
          🎲 Überrasch mich
        </a>
      </div>

      <DiscoverList communities={communities} categories={categories} />
    </div>
  );
}
