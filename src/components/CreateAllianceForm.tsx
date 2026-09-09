"use client";

import { useActionState } from "react";
import Link from "next/link";
import { createAllianceAction, type AllianceFormState } from "@/lib/actions";
import type { CommunitySummary } from "@/lib/types";

const initialState: AllianceFormState = {};

export default function CreateAllianceForm({
  communities,
  preselectedId,
}: {
  communities: CommunitySummary[];
  preselectedId?: string;
}) {
  const [state, formAction, pending] = useActionState(createAllianceAction, initialState);

  if (state.success) {
    return (
      <div className="rounded-2xl border border-teal bg-teal-soft p-6 text-center">
        <p className="text-2xl">🤝</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-ink">
          Bündnis gegründet!
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Weitere Communities können ihm jetzt über ihr Dashboard beitreten.
        </p>
        <Link
          href={`/alliance/${state.slug}`}
          className="mt-4 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg hover:opacity-85"
        >
          Bündnis ansehen
        </Link>
      </div>
    );
  }

  if (communities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-bg-raised p-8 text-center text-ink-soft">
        Du brauchst eine freigeschaltete Community ohne Bündnis, um eines zu
        gründen.
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <Field label="Gründende Community">
        <select name="foundingCommunityId" required defaultValue={preselectedId ?? ""} className="input">
          <option value="">Bitte wählen…</option>
          {communities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.iconEmoji} {c.name}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Name des Bündnisses">
        <input name="name" required minLength={3} placeholder="z. B. Nordbund" className="input" />
      </Field>

      <Field label="Icon">
        <select name="icon" defaultValue="🤝" className="input">
          <option value="🤝">🤝</option>
          <option value="🛡️">🛡️</option>
          <option value="⚔️">⚔️</option>
          <option value="🌟">🌟</option>
          <option value="🔥">🔥</option>
          <option value="🌐">🌐</option>
        </select>
      </Field>

      <Field label="Beschreibung">
        <textarea
          name="description"
          required
          minLength={10}
          rows={3}
          placeholder="Wofür steht euer Bündnis? Wer soll beitreten?"
          className="input resize-none"
        />
      </Field>

      {state.error && (
        <p className="rounded-xl bg-accent-soft px-4 py-2 text-sm text-accent-ink">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3 font-medium text-bg transition hover:opacity-85 disabled:opacity-50"
      >
        {pending ? "Wird gegründet…" : "Bündnis gründen"}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--line);
          background: var(--bg);
          padding: 0.6rem 0.9rem;
          color: var(--ink);
          font-size: 0.9rem;
          outline: none;
        }
        .input:focus {
          border-color: var(--teal);
        }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      {children}
    </label>
  );
}
