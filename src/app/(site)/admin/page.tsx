import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getPendingCommunities } from "@/lib/queries";
import { approveCommunityAction, rejectCommunityAction } from "@/lib/actions";
import { tierForLevel } from "@/lib/cityTier";

export const metadata = { title: "Admin" };

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const pending = await getPendingCommunities();

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
        Admin
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Prüf-Warteschlange
      </h1>
      <p className="mt-2 rounded-xl bg-accent-soft px-4 py-2 text-sm text-accent-ink">
        Demo-Modus: In Produktion ist dieser Bereich nur für Nutzer mit
        Admin-Rolle sichtbar, angemeldet als {user.username}.
      </p>

      {pending.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-line bg-bg-raised p-10 text-center text-ink-faint">
          Keine offenen Einreichungen. 🎉
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {pending.map((c) => (
            <div key={c.id} className="rounded-2xl border border-line bg-bg-raised p-5">
              <div className="flex items-start gap-3">
                <span
                  className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${c.colorHex}22` }}
                >
                  {c.iconEmoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-display text-lg font-semibold text-ink">
                    {c.name}
                  </p>
                  <p className="text-sm text-ink-faint">
                    {c.category.icon} {c.category.name} · {c.language} · 👥{" "}
                    {c.memberCount.toLocaleString("de-DE")}
                  </p>
                  <p className="mt-2 text-sm text-ink-soft">{c.description}</p>
                  <a
                    href={c.inviteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs text-teal underline"
                  >
                    {c.inviteUrl}
                  </a>
                </div>
              </div>

              <div className="mt-4 grid gap-3 border-t border-line-soft pt-4 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
                <form
                  id={`approve-${c.id}`}
                  action={approveCommunityAction}
                  className="contents"
                >
                  <input type="hidden" name="id" value={c.id} />
                  <label className="flex flex-col gap-1 text-xs text-ink-faint">
                    Stadt-Level ({tierForLevel(1).name} ab 1)
                    <input
                      name="level"
                      type="number"
                      min={1}
                      defaultValue={1}
                      className="rounded-lg border border-line bg-bg px-2.5 py-1.5 text-sm text-ink"
                    />
                  </label>
                  <label className="flex flex-col gap-1 text-xs text-ink-faint">
                    Aktivität
                    <select
                      name="activityLabel"
                      defaultValue="Mittel"
                      className="rounded-lg border border-line bg-bg px-2.5 py-1.5 text-sm text-ink"
                    >
                      <option>Niedrig</option>
                      <option>Mittel</option>
                      <option>Hoch</option>
                      <option>Sehr hoch</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1 text-xs text-ink-faint">
                    Wachstum (%)
                    <input
                      name="growthPercent"
                      type="number"
                      min={0}
                      defaultValue={0}
                      className="rounded-lg border border-line bg-bg px-2.5 py-1.5 text-sm text-ink"
                    />
                  </label>
                  <button
                    type="submit"
                    className="rounded-full bg-teal px-4 py-2 text-sm font-medium text-bg-raised hover:opacity-85"
                  >
                    ✓ Annehmen
                  </button>
                </form>
              </div>

              <form action={rejectCommunityAction} className="mt-3 flex gap-2">
                <input type="hidden" name="id" value={c.id} />
                <input
                  name="notes"
                  placeholder="Grund für Ablehnung (optional)"
                  className="flex-1 rounded-lg border border-line bg-bg px-2.5 py-1.5 text-sm text-ink"
                />
                <button
                  type="submit"
                  className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-accent hover:text-accent-ink"
                >
                  ✕ Ablehnen
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
