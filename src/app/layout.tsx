import type { Metadata } from "next";
import { Fraunces, Public_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import CommandPaletteProvider from "@/components/CommandPaletteProvider";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

// Jede Seite hängt über CommandPaletteProvider (und meist auch direkt) an
// Live-DB-Daten — kein statischer Inhalt, den man cachen könnte. Erzwingt
// dynamisches Rendering, damit "next build" nie eine DB-Verbindung braucht
// (relevant für den Docker-Build-Stage, der keine DB erreicht).
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    default: "EselWorld — Entdecke deine nächste Community",
    template: "%s · EselWorld",
  },
  description:
    "Acht Länder. Hunderte Städte. Eine Karte, auf der jede Discord-Community lebt, wächst und sich verbündet. Entdecke deine nächste Community auf EselWorld.",
};

const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('eselworld-theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="de"
      suppressHydrationWarning
      className={`${fraunces.variable} ${publicSans.variable} ${plexMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full font-sans">
        {children}
        <CommandPaletteProvider />
      </body>
    </html>
  );
}
