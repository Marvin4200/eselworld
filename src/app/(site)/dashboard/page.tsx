import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { getAlliances, getOwnedCommunitiesWithActivity } from "@/lib/queries";
import { joinAllianceAction, leaveAllianceAction, logoutAction, simulateActivityDayAction } from "@/lib/actions";
import CityTierBadge from "@/components/CityTierBadge";
import XpProgressBar from "@/components/XpProgressBar";
import ActivitySparkline from "@/components/ActivitySparkline";
import EditProfileForm from "@/components/EditProfileForm";

const STATUS_STYLE: Record<string, string> = {
  approved: "bg-teal-soft text-teal",
  pending: "bg-accent-soft text-accent-ink",
  rejected: "bg-bg-sunken text-ink-faint",
};

const STATUS_LABEL: Record<string, string> = {
  approved: "Live auf der Karte",
  pending: "Wird geprüft",
  rejected: "Abgelehnt",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [communities, alliances] = await Promise.all([
    getOwnedCommunitiesWithActivity(user.id),
    getAlliances(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
            Dashboard
          </p>
          <h1 className="font-display text-3xl font-semibold text-ink">
            Hallo, {user.username} {user.avatarEmoji}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/u/${user.username}`}
            className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-teal"
          >
            👤 Profil ansehen
          </Link>
          <form action={logoutAction}>
            <button className="rounded-full border border-line px-4 py-2 text-sm text-ink-soft hover:border-teal">
              Abmelden
            </button>
          </form>
        </div>
      </div>

      <details className="mt-6 rounded-2xl border border-line bg-bg-raised p-4">
        <summary className="cursor-pointer text-sm font-medium text-ink">
          ✏️ Profil bearbeiten
        </summary>
        <div className="mt-4 border-t border-line-soft pt-4">
          <EditProfileForm
            username={user.username}
            avatarEmoji={user.avatarEmoji}
            bio={user.bio}
            accentColor={user.accentColor}
            website={user.website}
          />
        </div>
      </details>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">
          Deine Communities
        </h2>
        <Link
          href="/submit"
          className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-bg hover:opacity-85"
        >
          + Neue Community
        </Link>
      </div>

      {communities.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-line bg-bg-raised p-10 text-center">
          <p className="text-2xl">🏕️</p>
          <p className="mt-2 font-medium text-ink">Noch keine eigene Stadt</p>
          <p className="mt-1 text-sm text-ink-faint">
            Reich deine Community ein und beobachte, wie ihre Stadt von einem
            Lager zur Metropole wächst.
          </p>
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-4">
          {communities.map((c) => (
            <div key={c.id} className="rounded-2xl border border-line bg-bg-raised p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-xl text-xl"
                    style={{ backgroundColor: `${c.colorHex}22` }}
                  >
                    {c.iconEmoji}
                  </span>
                  <div>
                    <p className="font-medium text-ink">{c.name}</p>
                    <p className="text-xs text-ink-faint">
                      {c.category.icon} {c.category.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {c.status === "approved" && <CityTierBadge level={c.level} />}
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLE[c.status]}`}
                  >
                    {STATUS_LABEL[c.status]}
                  </span>
                  {c.status === "approved" && (
                    <Link
                      href={`/community/${c.slug}`}
                      className="text-xs text-teal underline"
                    >
                      Ansehen
                    </Link>
                  )}
                </div>
              </div>

              {c.status === "approved" && (
                <div className="mt-4 border-t border-line-soft pt-4">
                  <XpProgressBar xpTotal={c.xpTotal} />

                  <div className="mt-4 flex items-center justify-between text-xs text-ink-faint">
                    <span>
                      🔥 {c.currentStreak}{" "}
                      {c.currentStreak === 1 ? "Tag" : "Tage"} Streak
                    </span>
                    <span>Letzte Aktivität: {c.recentActivity.length} von 14 Tagen erfasst</span>
                  </div>

                  <div className="mt-3">
                    <ActivitySparkline points={c.recentActivity} />
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <form action={simulateActivityDayAction}>
                      <input type="hidden" name="communityId" value={c.id} />
                      <button
                        type="submit"
                        className="rounded-full bg-teal px-4 py-2 text-xs font-medium text-bg-raised hover:opacity-85"
                      >
                        🌱 Tag simulieren (Demo)
                      </button>
                    </form>
                    <button
                      type="button"
                      disabled
                      title="Kommt, sobald der EselWorld-Bot verfügbar ist"
                      className="cursor-not-allowed rounded-full border border-line px-4 py-2 text-xs text-ink-faint"
                    >
                      🤖 Bot verbinden — bald verfügbar
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-ink-faint">
                    Solange kein Bot verbunden ist, kannst du hier einen
                    plausiblen Aktivitätstag simulieren, um zu sehen, wie
                    deine Stadt wachsen würde.
                  </p>

                  <div className="mt-4 border-t border-line-soft pt-4">
                    {c.alliance ? (
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <Link
                          href={`/alliance/${c.alliance.slug}`}
                          className="flex items-center gap-2 text-sm text-ink"
                        >
                          <span
                            className="grid h-7 w-7 place-items-center rounded-full text-sm"
                            style={{ backgroundColor: `${c.alliance.colorHex}22` }}
                          >
                            {c.alliance.icon}
                          </span>
                          Bündnis: <strong>{c.alliance.name}</strong>
                        </Link>
                        <form action={leaveAllianceAction}>
                          <input type="hidden" name="communityId" value={c.id} />
                          <button className="text-xs text-ink-faint underline hover:text-ink">
                            Bündnis verlassen
                          </button>
                        </form>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        <form action={joinAllianceAction} className="flex items-center gap-2">
                          <input type="hidden" name="communityId" value={c.id} />
                          <select
                            name="allianceId"
                            required
                            className="rounded-full border border-line bg-bg px-3 py-1.5 text-xs text-ink-soft"
                          >
                            <option value="">Bündnis wählen…</option>
                            {alliances.map((a) => (
                              <option key={a.id} value={a.id}>
                                {a.icon} {a.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="submit"
                            disabled={alliances.length === 0}
                            className="rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft hover:border-teal disabled:opacity-40"
                          >
                            Beitreten
                          </button>
                        </form>
                        <Link
                          href={`/alliances/new?communityId=${c.id}`}
                          className="text-xs text-teal underline"
                        >
                          + Neues Bündnis gründen
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
