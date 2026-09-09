import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { loginAsAction } from "@/lib/actions";
import { redirect } from "next/navigation";

export const metadata = { title: "Anmelden" };

export default async function LoginPage() {
  const current = await getCurrentUser();
  if (current) redirect("/dashboard");

  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
        Anmelden
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Auf geht&apos;s
      </h1>
      <p className="mt-2 text-ink-soft">
        Die echte Discord-Anmeldung ist noch nicht angeschlossen — wähl
        stattdessen ein Demo-Profil und probier den kompletten Flow selbst
        aus: Community einreichen, Stadt leveln, Bündnis gründen.
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {users.map((u) => (
          <form key={u.id} action={loginAsAction}>
            <input type="hidden" name="userId" value={u.id} />
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-2xl border border-line bg-bg-raised p-4 text-left transition hover:border-teal"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-teal-soft text-xl">
                {u.avatarEmoji}
              </span>
              <span>
                <span className="block font-medium text-ink">{u.username}</span>
                <span className="block text-xs text-ink-faint">
                  Als {u.username} fortfahren
                </span>
              </span>
            </button>
          </form>
        ))}
      </div>

      <p className="mt-8 text-xs text-ink-faint">
        Produktionsversion: Discord-OAuth2 über next-auth, siehe README.
      </p>
    </div>
  );
}
