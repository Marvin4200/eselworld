import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getCommunitiesByOwner } from "@/lib/queries";
import CreateAllianceForm from "@/components/CreateAllianceForm";

export const metadata = { title: "Bündnis gründen" };

export default async function NewAlliancePage({
  searchParams,
}: {
  searchParams: Promise<{ communityId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { communityId } = await searchParams;
  const owned = await getCommunitiesByOwner(user.id);
  const eligible = owned.filter((c) => c.status === "approved" && !c.alliance);

  return (
    <div className="mx-auto max-w-xl px-5 py-10">
      <Link href="/alliances" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-faint hover:text-ink">
        ← Alle Bündnisse
      </Link>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
        Bündnis gründen
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Verbündete finden
      </h1>
      <p className="mt-2 text-ink-soft">
        Ein Bündnis bündelt mehrere Communities sichtbar auf ihrer eigenen
        Seite — kein Wettkampf, sondern gemeinsamer Auftritt.
      </p>

      <div className="mt-8">
        <CreateAllianceForm communities={eligible} preselectedId={communityId} />
      </div>
    </div>
  );
}
