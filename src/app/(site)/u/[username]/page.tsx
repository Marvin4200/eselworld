import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getUserProfile } from "@/lib/queries";
import { getCurrentUser } from "@/lib/session";
import { computeUserBadges } from "@/lib/userBadges";
import CommunityCard from "@/components/CommunityCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  return { title: username };
}

type TimelineEvent = { date: Date; icon: string; text: React.ReactNode };

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const [profile, currentUser] = await Promise.all([
    getUserProfile(username),
    getCurrentUser(),
  ]);
  if (!profile) notFound();

  const isOwnProfile = currentUser?.id === profile.id;
  const joined = profile.createdAt.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const totalMembers = profile.communities.reduce((sum, c) => sum + c.memberCount, 0);
  const topLevel = profile.communities.reduce((max, c) => Math.max(max, c.level), 0);
  const landCount = new Set(profile.communities.map((c) => c.category.id)).size;

  const badges = computeUserBadges({
    createdAt: profile.createdAt,
    communityCount: profile.communities.length,
    landCount,
    topLevel,
    allianceFoundedCount: profile.alliancesFounded.length,
  });

  const timeline: TimelineEvent[] = [
    {
      date: profile.createdAt,
      icon: "🎉",
      text: "Ist EselWorld beigetreten",
    },
    ...profile.communities.map((c) => ({
      date: c.createdAt,
      icon: c.iconEmoji,
      text: (
        <>
          Gründete{" "}
          <Link href={`/community/${c.slug}`} className="text-teal hover:underline">
            {c.name}
          </Link>
        </>
      ),
    })),
    ...profile.alliancesFounded.map((a) => ({
      date: a.createdAt,
      icon: a.icon,
      text: (
        <>
          Gründete das Bündnis{" "}
          <Link href={`/alliance/${a.slug}`} className="text-teal hover:underline">
            {a.name}
          </Link>
        </>
      ),
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div
        className="rounded-2xl border p-6"
        style={{ borderColor: `${profile.accentColor}55`, background: `${profile.accentColor}0d` }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span
              className="grid h-20 w-20 shrink-0 place-items-center rounded-full text-4xl"
              style={{ backgroundColor: `${profile.accentColor}33` }}
            >
              {profile.avatarEmoji}
            </span>
            <div>
              <h1 className="font-display text-3xl font-semibold text-ink">
                {profile.username}
              </h1>
              <p className="mt-1 text-sm text-ink-faint">Mitglied seit {joined}</p>
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-sm hover:underline"
                  style={{ color: profile.accentColor }}
                >
                  🔗 {profile.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
          {isOwnProfile && (
            <Link
              href="/dashboard"
              className="rounded-full border border-line bg-bg-raised px-4 py-2 text-sm font-medium text-ink hover:border-teal"
            >
              ✏️ Profil bearbeiten
            </Link>
          )}
        </div>

        {profile.bio && (
          <p className="mt-5 max-w-xl leading-relaxed text-ink-soft">{profile.bio}</p>
        )}

        {badges.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <span
                key={b.label}
                className="rounded-full border border-line bg-bg-raised px-2.5 py-1 text-xs text-ink-soft"
              >
                {b.icon} {b.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 sm:max-w-md">
        <div className="rounded-xl border border-line bg-bg-raised p-3 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            {profile.communities.length}
          </p>
          <p className="text-xs text-ink-faint">Städte</p>
        </div>
        <div className="rounded-xl border border-line bg-bg-raised p-3 text-center">
          <p className="font-display text-xl font-semibold text-ink">
            {totalMembers.toLocaleString("de-DE")}
          </p>
          <p className="text-xs text-ink-faint">Mitglieder</p>
        </div>
        <div className="rounded-xl border border-line bg-bg-raised p-3 text-center">
          <p className="font-display text-xl font-semibold" style={{ color: profile.accentColor }}>
            {topLevel > 0 ? `Lv. ${topLevel}` : "—"}
          </p>
          <p className="text-xs text-ink-faint">Höchstes Level</p>
        </div>
      </div>

      {profile.alliancesFounded.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-ink">
            Gegründete Bündnisse
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {profile.alliancesFounded.map((a) => (
              <Link
                key={a.id}
                href={`/alliance/${a.slug}`}
                className="flex items-center gap-2 rounded-full border border-line bg-bg-raised px-3 py-1.5 text-sm text-ink hover:border-teal"
              >
                <span>{a.icon}</span>
                {a.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink">
          {isOwnProfile ? "Deine Städte" : `Städte von ${profile.username}`}
        </h2>
        {profile.communities.length === 0 ? (
          <div className="mt-4 rounded-2xl border border-dashed border-line bg-bg-raised p-10 text-center text-ink-faint">
            Noch keine Stadt gegründet.
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {profile.communities.map((c) => (
              <CommunityCard key={c.id} c={c} />
            ))}
          </div>
        )}
      </section>

      {profile.favorites.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">
            {isOwnProfile ? "Deine Favoriten" : `Favoriten von ${profile.username}`}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {profile.favorites.map((c) => (
              <CommunityCard key={c.id} c={c} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-lg font-semibold text-ink">Verlauf</h2>
        <div className="mt-4 flex flex-col gap-0 border-l-2 border-line pl-5">
          {timeline.map((event, i) => (
            <div key={i} className={`relative ${i === timeline.length - 1 ? "pb-0" : "pb-5"}`}>
              <span
                className="absolute -left-[27px] top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 bg-bg text-[10px]"
                style={{ borderColor: profile.accentColor }}
              >
                {event.icon}
              </span>
              <p className="text-sm text-ink-soft">
                {event.text}
                <span className="ml-2 text-xs text-ink-faint">
                  {event.date.toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" })}
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
