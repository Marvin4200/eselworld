import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getCategories } from "@/lib/queries";
import SubmitForm from "@/components/SubmitForm";

export const metadata = { title: "Community hinzufügen" };

const GUIDELINES = [
  { icon: "🔗", text: "Ein permanenter Discord-Invite, der nicht abläuft" },
  { icon: "🇩🇪", text: "Echter, aktiver Server — kein Platzhalter oder Testserver" },
  { icon: "✍️", text: "Ehrliche Beschreibung und Mitgliederzahl" },
  { icon: "🚫", text: "Kein NSFW-, Hass- oder illegaler Content" },
  { icon: "🏷️", text: "Das passende Land — bestimmt, wo eure Stadt erscheint" },
];

export default async function SubmitPage() {
  const [user, categories] = await Promise.all([getCurrentUser(), getCategories()]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-10">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
        Community hinzufügen
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Deine Community auf die Karte bringen
      </h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        Jede Einreichung wird manuell geprüft, bevor die Stadt auf der Karte
        erscheint — das dauert in der Regel 1–2 Tage. Level 1 ist nur der
        Anfang: Danach wächst deine Stadt durch echte Aktivität.
      </p>

      <div className="mt-6 rounded-2xl border border-line-soft bg-bg-sunken p-4">
        <p className="text-sm font-medium text-ink">Bevor du einreichst</p>
        <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2">
          {GUIDELINES.map((g) => (
            <li key={g.text} className="flex items-start gap-2 text-sm text-ink-soft">
              <span>{g.icon}</span>
              {g.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        {user ? (
          <SubmitForm categories={categories} />
        ) : (
          <div className="max-w-xl rounded-2xl border border-dashed border-line bg-bg-raised p-8 text-center">
            <p className="text-ink-soft">
              Melde dich mit Discord an, um eine Community einzureichen.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg hover:opacity-85"
            >
              Mit Discord anmelden
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
