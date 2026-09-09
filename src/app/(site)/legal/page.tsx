export const metadata = { title: "Impressum & Datenschutz" };

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-14">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
        Rechtliches
      </p>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Impressum &amp; Datenschutz
      </h1>

      <div className="mt-6 rounded-2xl border border-accent bg-accent-soft p-4 text-sm text-accent-ink">
        Platzhalter-Seite: Diese MVP-Version enthält noch keine echten
        Betreiberangaben. Vor dem Live-Gang müssen Impressum (§ 5 TMG) und
        Datenschutzerklärung (DSGVO) mit den echten Angaben vervollständigt
        werden.
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">Impressum</h2>
        <p className="mt-2 text-sm text-ink-soft">
          Angaben gemäß § 5 TMG: Name, Anschrift, Kontakt (E-Mail/Telefon) des
          Betreibers — hier einzutragen.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold text-ink">
          Datenschutz
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          EselWorld verarbeitet Discord-Zugangsdaten (Nutzername, Avatar) zur
          Anmeldung sowie die von Community-Ownern eingereichten
          Community-Informationen. Der EselWorld-Bot (ab V2) speichert
          ausschließlich tägliche, aggregierte Aktivitätswerte pro Server —
          niemals Nachrichteninhalte. Details zu Auftragsverarbeitung,
          Speicherdauer und Betroffenenrechten folgen mit dem Produktivbetrieb.
        </p>
      </section>
    </div>
  );
}
