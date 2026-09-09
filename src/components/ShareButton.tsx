"use client";

import { useState } from "react";

export default function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
        return;
      }
    } catch {
      // Nutzer hat den Share-Dialog abgebrochen — dann still zum Kopieren wechseln.
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard-API nicht verfügbar — nichts weiter zu tun.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="rounded-full border border-line px-6 py-3 text-center font-medium text-ink transition hover:border-teal"
    >
      {copied ? "🔗 Link kopiert!" : "🔗 Teilen"}
    </button>
  );
}
