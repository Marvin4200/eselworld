"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { submitCommunityAction, type SubmitState } from "@/lib/actions";
import type { CategoryOption } from "@/lib/types";
import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from "@/lib/categoryColors";
import { tierForLevel } from "@/lib/cityTier";

const EMOJI_CHOICES = ["🏕️", "🎮", "🎭", "⛏️", "🎵", "😂", "🤖", "🏎️", "🎨", "🧭", "🏆", "🫏"];

const initialState: SubmitState = {};

export default function SubmitForm({ categories }: { categories: CategoryOption[] }) {
  const [state, formAction, pending] = useActionState(submitCommunityAction, initialState);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("🏕️");
  const [categorySlug, setCategorySlug] = useState("");
  const [language, setLanguage] = useState("Deutsch");
  const [memberCount, setMemberCount] = useState(0);
  const [tags, setTags] = useState("");

  const activeCategory = categories.find((c) => c.slug === categorySlug);
  const color = categorySlug ? CATEGORY_COLORS[categorySlug] ?? DEFAULT_CATEGORY_COLOR : DEFAULT_CATEGORY_COLOR;
  const tagList = useMemo(
    () => tags.split(",").map((t) => t.trim()).filter(Boolean),
    [tags]
  );

  if (state.success) {
    return (
      <div className="rounded-2xl border border-teal bg-teal-soft p-6 text-center">
        <p className="text-2xl">✅</p>
        <h2 className="mt-2 font-display text-xl font-semibold text-ink">
          Danke! Deine Community wurde eingereicht.
        </h2>
        <p className="mt-1 text-sm text-ink-soft">
          Ein Admin prüft die Einreichung — Status siehst du in deinem{" "}
          <Link href="/dashboard" className="underline hover:text-teal">
            Dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
      <form action={formAction} className="flex flex-col gap-5">
        <Field label="Name der Community">
          <input
            name="name"
            required
            minLength={3}
            placeholder="z. B. Nachtschicht Beats"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field>

        <Field label="Discord-Invite-Link" hint="Ein permanenter, nie ablaufender Invite (Servereinstellungen → Einladungen).">
          <input
            name="inviteUrl"
            required
            type="url"
            placeholder="https://discord.gg/deinserver"
            pattern="https://discord\.gg/.+"
            className="input"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Land" hint="Wo deine Stadt auf der Karte erscheint.">
            <select
              name="categoryId"
              required
              className="input"
              onChange={(e) => {
                const opt = e.target.selectedOptions[0];
                setCategorySlug(opt?.dataset.slug ?? "");
              }}
            >
              <option value="">Bitte wählen…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id} data-slug={c.slug}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sprache">
            <input
              name="language"
              required
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input"
            />
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Ungefähre Mitgliederzahl">
            <input
              name="memberCount"
              type="number"
              min={0}
              required
              value={memberCount}
              onChange={(e) => setMemberCount(Number(e.target.value) || 0)}
              className="input"
            />
          </Field>
          <Field label="Icon">
            <select name="iconEmoji" value={icon} onChange={(e) => setIcon(e.target.value)} className="input">
              {EMOJI_CHOICES.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Beschreibung" hint="Mind. 20 Zeichen — was macht eure Community besonders?">
          <textarea
            name="description"
            required
            minLength={20}
            rows={4}
            placeholder="Worum geht es in deiner Community? Was macht sie besonders?"
            className="input resize-none"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Field label="Tags (kommagetrennt)">
          <input
            name="tags"
            placeholder="Deutsch, Roleplay, FiveM"
            className="input"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </Field>

        {state.error && (
          <p className="rounded-xl bg-accent-soft px-4 py-2 text-sm text-accent-ink">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-ink px-6 py-3 font-medium text-bg transition hover:opacity-85 disabled:opacity-50"
        >
          {pending ? "Wird eingereicht…" : "Zur Prüfung einreichen"}
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

      {/* Live-Vorschau */}
      <div className="lg:sticky lg:top-20">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
          Vorschau
        </p>
        <div className="rounded-2xl border border-line bg-bg-raised p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <span
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-2xl"
              style={{ backgroundColor: `${color}22` }}
            >
              {icon}
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-display text-lg font-semibold text-ink">
                {name || "Deine Community"}
              </h3>
              <p className="truncate text-sm text-ink-faint">
                {activeCategory ? `${activeCategory.icon} ${activeCategory.name}` : "Land wählen"} · {language || "—"}
              </p>
            </div>
          </div>
          <p className="mt-3 line-clamp-3 text-sm text-ink-soft">
            {description || "Deine Beschreibung erscheint hier…"}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-2.5 py-1 text-xs font-medium text-ink-soft">
              {tierForLevel(1).emoji} {tierForLevel(1).name} · Lv. 1
            </span>
            <span className="text-xs text-ink-faint">
              👥 {memberCount.toLocaleString("de-DE")}
            </span>
          </div>
          {tagList.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tagList.map((t) => (
                <span key={t} className="rounded-full bg-bg-sunken px-2 py-0.5 text-xs text-ink-soft">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
        <p className="mt-3 text-xs leading-relaxed text-ink-faint">
          So erscheint deine Stadt auf der Karte und in der Liste, sobald sie
          freigeschaltet ist. Das Start-Level schätzt ein Admin — danach
          wächst es durch echte Aktivität.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      {children}
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </label>
  );
}
