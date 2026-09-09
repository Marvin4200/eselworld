import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllianceBySlug } from "@/lib/queries";
import CommunityCard from "@/components/CommunityCard";

export default async function AlliancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const alliance = await getAllianceBySlug(slug);
  if (!alliance) notFound();

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link href="/alliances" className="mb-6 inline-flex items-center gap-1 text-sm text-ink-faint hover:text-ink">
        ← Alle Bündnisse
      </Link>

      <div className="flex items-start gap-4">
        <span
          className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl text-3xl"
          style={{ backgroundColor: `${alliance.colorHex}22` }}
        >
          {alliance.icon}
        </span>
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">{alliance.name}</h1>
          <p className="mt-1 text-ink-faint">
            Gegründet von {alliance.owner.avatarEmoji} {alliance.owner.username}
          </p>
        </div>
      </div>

      <p className="mt-4 max-w-2xl leading-relaxed text-ink-soft">{alliance.description}</p>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
        <div className="rounded-xl border border-line bg-bg-raised p-3 text-center">
          <p className="font-display text-xl font-semibold text-ink">{alliance.memberCount}</p>
          <p className="text-xs text-ink-faint">Communities</p>
        </div>
        <div className="rounded-xl border border-line bg-bg-raised p-3 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            {alliance.totalMembers.toLocaleString("de-DE")}
          </p>
          <p className="text-xs text-ink-faint">Mitglieder</p>
        </div>
        <div className="rounded-xl border border-line bg-bg-raised p-3 text-center">
          <p className="font-display text-xl font-semibold text-teal">Lv. {alliance.avgLevel}</p>
          <p className="text-xs text-ink-faint">Ø Stadt-Level</p>
        </div>
      </div>

      <h2 className="mt-10 font-display text-lg font-semibold text-ink">Mitglieder</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alliance.members.map((c) => (
          <CommunityCard key={c.id} c={c} />
        ))}
      </div>
    </div>
  );
}
