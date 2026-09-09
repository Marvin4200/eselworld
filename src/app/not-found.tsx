import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-bg px-5 text-center">
      <p className="text-6xl">🫏🗺️</p>
      <h1 className="font-display text-3xl font-semibold text-ink">
        Diese Stadt steht noch nicht auf der Karte
      </h1>
      <p className="max-w-md text-ink-soft">
        Der Weg, den du eingeschlagen hast, führt ins Wasser. Vielleicht ist
        er falsch geschrieben — oder er wartet noch darauf, gegründet zu
        werden.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="rounded-full bg-ink px-6 py-3 text-center font-medium text-bg transition hover:opacity-85"
        >
          🌍 Zur Weltkarte
        </Link>
        <Link
          href="/discover"
          className="rounded-full border border-line px-6 py-3 text-center font-medium text-ink hover:border-teal"
        >
          🔎 Communities entdecken
        </Link>
      </div>
    </div>
  );
}
