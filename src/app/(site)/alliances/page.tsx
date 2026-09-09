import Link from "next/link";
import { getAlliances } from "@/lib/queries";

export const metadata = { title: "Bündnisse" };

export default async function AlliancesPage() {
  const alliances = await getAlliances();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
        Bündnisse
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Gemeinsam stärker
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Communities können sich zu Bündnissen zusammenschließen — über
        Länder-Grenzen hinweg. Kein Wettkampf gegeneinander, sondern
        Sichtbarkeit und Status für eine Gruppe befreundeter Communities.
        Bündnisse gründest oder trittst du über dein{" "}
        <Link href="/dashboard" className="text-teal underline">
          Dashboard
        </Link>{" "}
        bei.
      </p>

      {alliances.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-line bg-bg-raised p-10 text-center text-ink-faint">
          Noch kein Bündnis gegründet — sei das erste.
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {alliances.map((a) => (
            <Link
              key={a.id}
              href={`/alliance/${a.slug}`}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-bg-raised p-5 transition hover:-translate-y-0.5 hover:border-teal hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-3">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${a.colorHex}22` }}
                >
                  {a.icon}
                </span>
                <div>
                  <p className="font-display text-lg font-semibold text-ink">{a.name}</p>
                  <p className="text-sm text-ink-faint">{a.description}</p>
                </div>
              </div>
              <div className="flex shrink-0 gap-4 text-sm text-ink-soft sm:text-right">
                <div>
                  <p className="font-semibold text-ink">{a.memberCount}</p>
                  <p className="text-xs text-ink-faint">Communities</p>
                </div>
                <div>
                  <p className="font-semibold text-ink">{a.totalMembers.toLocaleString("de-DE")}</p>
                  <p className="text-xs text-ink-faint">Mitglieder</p>
                </div>
                <div>
                  <p className="font-semibold text-ink">⌀ Lv. {a.avgLevel}</p>
                  <p className="text-xs text-ink-faint">Schnitt</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
