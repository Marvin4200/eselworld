"use client";

import { useActionState, useState } from "react";
import { updateProfileAction, type ProfileFormState } from "@/lib/actions";

const AVATAR_CHOICES = ["🧑‍💻", "🌱", "🎮", "🎧", "🎨", "🚗", "🏆", "🤖", "🎭", "🫏", "🦊", "🐙"];

const ACCENT_CHOICES = [
  "#1F7A6C",
  "#B8792A",
  "#C9587A",
  "#6C6FB0",
  "#5FA363",
  "#D98A3D",
  "#A6598B",
  "#3E86C9",
];

const initialState: ProfileFormState = {};

export default function EditProfileForm({
  username,
  avatarEmoji,
  bio,
  accentColor,
  website,
}: {
  username: string;
  avatarEmoji: string;
  bio: string | null;
  accentColor: string;
  website: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);
  const [selectedAccent, setSelectedAccent] = useState(accentColor);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid grid-cols-[auto_1fr] gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Avatar</span>
          <select name="avatarEmoji" defaultValue={avatarEmoji} className="input w-20 text-center text-xl">
            {AVATAR_CHOICES.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink-soft">Nutzername</span>
          <input name="username" defaultValue={username} required minLength={2} maxLength={24} className="input" />
        </label>
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Bio</span>
        <textarea
          name="bio"
          defaultValue={bio ?? ""}
          maxLength={200}
          rows={3}
          placeholder="Erzähl kurz, wer du bist oder was du auf EselWorld machst…"
          className="input resize-none"
        />
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Website (optional)</span>
        <input
          name="website"
          type="url"
          defaultValue={website ?? ""}
          placeholder="https://deine-seite.de"
          className="input"
        />
      </label>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-ink-soft">Profilfarbe</span>
        <input type="hidden" name="accentColor" value={selectedAccent} />
        <div className="flex flex-wrap gap-2">
          {ACCENT_CHOICES.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedAccent(color)}
              aria-label={`Farbe ${color} wählen`}
              aria-pressed={selectedAccent === color}
              className="h-8 w-8 rounded-full transition"
              style={{
                backgroundColor: color,
                outline: selectedAccent === color ? "2px solid var(--ink)" : "2px solid transparent",
                outlineOffset: 2,
              }}
            />
          ))}
        </div>
      </div>

      {state.error && (
        <p className="rounded-xl bg-accent-soft px-4 py-2 text-sm text-accent-ink">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition hover:opacity-85 disabled:opacity-50"
      >
        {pending ? "Wird gespeichert…" : "Profil speichern"}
      </button>

      <style jsx>{`
        .input {
          border-radius: 0.75rem;
          border: 1px solid var(--line);
          background: var(--bg);
          padding: 0.5rem 0.75rem;
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
