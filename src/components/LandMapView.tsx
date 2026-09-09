"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CommunitySummary } from "@/lib/types";
import { tierForLevel } from "@/lib/cityTier";
import type { Land, LandPlot } from "@/lib/worldMap";
import { LAND_VIEW_H, LAND_VIEW_W, plotById, roadsForLand, textureForLand } from "@/lib/worldMap";

const MIN_SCALE = 0.8;
const MAX_SCALE = 3.5;
const LABEL_ZOOM_THRESHOLD = 1.1;

type Props = {
  land: Land;
  plots: LandPlot[];
  communities: CommunitySummary[];
};

export default function LandMapView({ land, plots, communities }: Props) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedEmptyPlot, setSelectedEmptyPlot] = useState<number | null>(null);
  const dragRef = useRef<{
    dragging: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  const occupied = new Set(communities.map((c) => c.plotIndex).filter((i): i is number => i !== null));
  const emptyPlots = plots.filter((p) => !occupied.has(p.index));
  const selected = communities.find((c) => c.id === selectedId) ?? null;
  const showLabels = view.scale > LABEL_ZOOM_THRESHOLD;

  function toViewCoords(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (LAND_VIEW_W / rect.width),
      y: (clientY - rect.top) * (LAND_VIEW_H / rect.height),
    };
  }

  function zoomAt(clientX: number, clientY: number, factor: number) {
    setView((v) => {
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor));
      const point = toViewCoords(clientX, clientY);
      const worldX = (point.x - v.x) / v.scale;
      const worldY = (point.y - v.y) / v.scale;
      return {
        scale: newScale,
        x: point.x - worldX * newScale,
        y: point.y - worldY * newScale,
      };
    });
  }

  const zoomAtRef = useRef(zoomAt);
  useEffect(() => {
    zoomAtRef.current = zoomAt;
  });
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      zoomAtRef.current(e.clientX, e.clientY, e.deltaY > 0 ? 0.9 : 1.1);
    }
    svg.addEventListener("wheel", onWheel, { passive: false });
    return () => svg.removeEventListener("wheel", onWheel);
  }, []);

  function handlePointerDown(e: React.PointerEvent<SVGSVGElement>) {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragRef.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      origX: view.x,
      origY: view.y,
    };
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag?.dragging) return;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    if (Math.abs(e.clientX - drag.startX) > 2 || Math.abs(e.clientY - drag.startY) > 2) {
      drag.moved = true;
    }
    setView((v) => ({
      ...v,
      x: drag.origX + (e.clientX - drag.startX) * (LAND_VIEW_W / rect.width),
      y: drag.origY + (e.clientY - drag.startY) * (LAND_VIEW_H / rect.height),
    }));
  }

  function endDrag() {
    if (dragRef.current) dragRef.current.dragging = false;
  }

  function selectCommunity(id: string) {
    if (dragRef.current?.moved) return;
    setSelectedEmptyPlot(null);
    setSelectedId(id);
  }

  function selectEmptyPlot(index: number) {
    if (dragRef.current?.moved) return;
    setSelectedId(null);
    setSelectedEmptyPlot(index);
  }

  function closePanel() {
    setSelectedId(null);
    setSelectedEmptyPlot(null);
  }

  const { theme } = land;
  const allTexture = textureForLand(land.id);
  const sortedByY = [...allTexture].sort((a, b) => a.y - b.y);
  const mountainPoints = sortedByY.slice(0, 4);
  const iconPoints = sortedByY.slice(4);
  const roads = roadsForLand(land.id);

  return (
    <div className="relative h-full w-full" style={{ background: theme.waterDeep }}>
      {/* breadcrumb + back */}
      <div className="pointer-events-none absolute left-4 top-4 z-20 flex items-center gap-2">
        <button
          onClick={() => router.push("/")}
          className="pointer-events-auto flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0f1526]/90 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur hover:border-white/30"
        >
          ← 🌍 EselWorld
        </button>
        <span className="rounded-full border border-white/10 bg-[#0f1526]/90 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur">
          {land.icon} {land.name}
        </span>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-full border border-white/10 bg-[#0f1526]/90 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur">
        🏙️ {communities.length}/{plots.length} Plätze belegt
      </div>

      {/* zoom controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          aria-label="Vergrößern"
          onClick={() => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1.25)}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#0f1526] text-lg text-white shadow hover:border-white/30"
        >
          +
        </button>
        <button
          aria-label="Verkleinern"
          onClick={() => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 0.8)}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#0f1526] text-lg text-white shadow hover:border-white/30"
        >
          −
        </button>
        <button
          aria-label="Ansicht zurücksetzen"
          onClick={() => setView({ x: 0, y: 0, scale: 1 })}
          className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#0f1526] text-xs text-[#aab2d1] shadow hover:border-white/30"
        >
          ⟲
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${LAND_VIEW_W} ${LAND_VIEW_H}`}
        className="h-full w-full touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        role="img"
        aria-label={`Karte von ${land.name} mit ${communities.length} Discord-Communities`}
      >
        <defs>
          <radialGradient id={`land-water-${land.id}`} cx="50%" cy="45%" r="75%">
            <stop offset="0%" stopColor={theme.water} />
            <stop offset="100%" stopColor={theme.waterDeep} />
          </radialGradient>
          <pattern id={`land-sparkle-${land.id}`} width="30" height="30" patternUnits="userSpaceOnUse">
            <circle cx="3" cy="3" r="1.3" fill={theme.accent} opacity="0.2" />
          </pattern>
          <filter id="land-cloud-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <rect x="0" y="0" width={LAND_VIEW_W} height={LAND_VIEW_H} fill={`url(#land-water-${land.id})`} />
        <rect
          x="0"
          y="0"
          width={LAND_VIEW_W}
          height={LAND_VIEW_H}
          fill={`url(#land-sparkle-${land.id})`}
          className="map-water-glimmer"
        />

        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
          <path d={land.shape} fill="none" stroke={theme.accentSoft} strokeWidth={34} strokeLinejoin="round" />
          <path d={land.shape} fill={theme.land} stroke={theme.landLine} strokeWidth={3} />

          {/* Berge: ein paar Gipfel im Hintergrund jeder Insel, mit
              land-spezifischer Note (Lava-Glut bei Gaming Lands, Schneekuppe
              bei Tech Valley). Positionen sind dieselben (sicher an Land
              liegenden) Punkte wie die Deko-Textur — nur die nördlichsten. */}
          {mountainPoints.map((m, i) => {
            const h = 46 + (i % 3) * 10;
            const w = 34 + (i % 2) * 10;
            return (
              <g key={`mtn-${i}`} style={{ pointerEvents: "none" }}>
                <polygon
                  points={`${m.x},${m.y - h} ${m.x - w},${m.y + h * 0.4} ${m.x + w},${m.y + h * 0.4}`}
                  fill={theme.landLine}
                  opacity={0.85}
                />
                <polygon
                  points={`${m.x},${m.y - h} ${m.x - w * 0.35},${m.y + h * 0.1} ${m.x + w * 0.15},${m.y + h * 0.1}`}
                  fill="#000000"
                  opacity={0.12}
                />
                {land.id === "tech-valley" && (
                  <polygon
                    points={`${m.x},${m.y - h} ${m.x - w * 0.32},${m.y - h * 0.45} ${m.x + w * 0.32},${m.y - h * 0.45}`}
                    fill="#eef6fb"
                    opacity={0.85}
                  />
                )}
                {land.id === "gaming-lands" && (
                  <circle cx={m.x} cy={m.y - h + 4} r={7} fill={theme.accent} className="map-lava-glow" />
                )}
              </g>
            );
          })}

          {/* Deko-Textur: kleine, transparente Kopien des Land-Icons als Landschaft */}
          {iconPoints.map((t, i) => (
            <text
              key={i}
              x={t.x}
              y={t.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={34}
              opacity={0.16}
              style={{ pointerEvents: "none" }}
            >
              {land.icon}
            </text>
          ))}

          {/* Straßen zwischen benachbarten Plätzen — rein dekorativ, mit
              leichtem "Energiefluss" zwischen den Städten */}
          {roads.map(([a, b], i) => {
            const pa = plotById(a);
            const pb = plotById(b);
            if (!pa || !pb) return null;
            return (
              <line
                key={i}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={theme.accent}
                strokeWidth={2.5}
                strokeDasharray="2 10"
                strokeLinecap="round"
                opacity={0.5}
                className="map-road-flow"
              />
            );
          })}

          {emptyPlots.map((p) => (
            <g
              key={`empty-${p.index}`}
              transform={`translate(${p.x} ${p.y})`}
              onClick={() => selectEmptyPlot(p.index)}
              className="cursor-pointer"
            >
              <circle
                r={11}
                fill="#0f1526"
                fillOpacity={0.5}
                stroke={theme.accent}
                strokeWidth={2}
                strokeDasharray="3 3"
                className="map-pulse-soft"
              />
              <text textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700} fill={theme.accent}>
                +
              </text>
              {showLabels && (
                <text y={26} textAnchor="middle" fontSize={12} fill="#eef1fb" stroke={theme.landLine} strokeWidth={3} paintOrder="stroke">
                  frei
                </text>
              )}
            </g>
          ))}

          {communities.map((c) => {
            const tier = tierForLevel(c.level);
            const isSelected = c.id === selectedId;
            const r = 16 * tier.scale * (isSelected ? 1.15 : 1);
            return (
              <g
                key={c.id}
                transform={`translate(${c.mapX} ${c.mapY})`}
                onClick={() => selectCommunity(c.id)}
                className="cursor-pointer"
              >
                {c.activityLabel === "Sehr hoch" && (
                  <circle r={r + 8} fill={theme.accent} className="map-pulse-glow" />
                )}
                <circle r={r} fill={c.colorHex} stroke={isSelected ? "#ffffff" : theme.landLine} strokeWidth={isSelected ? 3 : 2.5} />
                <text textAnchor="middle" dominantBaseline="central" fontSize={r * 1.05}>
                  {c.iconEmoji}
                </text>
                {showLabels && (
                  <text
                    y={r + 18}
                    textAnchor="middle"
                    fontSize={14}
                    fontWeight={700}
                    fill="#eef1fb"
                    stroke={theme.landLine}
                    strokeWidth={3.5}
                    paintOrder="stroke"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {c.name}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* treibende Wolken — atmosphärische Deko, unabhängig vom Zoom */}
        <g style={{ pointerEvents: "none" }} opacity={0.35}>
          <ellipse cx={300} cy={220} rx={180} ry={50} fill="#ffffff" filter="url(#land-cloud-blur)" className="map-cloud-drift" />
          <ellipse cx={1050} cy={1050} rx={200} ry={55} fill="#ffffff" filter="url(#land-cloud-blur)" className="map-cloud-drift-slow" />
        </g>
      </svg>

      {/* preview card */}
      <div
        className={`absolute right-4 top-1/2 z-30 w-full max-w-sm -translate-y-1/2 transform overflow-hidden rounded-2xl border border-white/10 bg-[#0f1526] shadow-2xl transition-all duration-300 ${
          selected || selectedEmptyPlot !== null
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-8 opacity-0"
        }`}
      >
        {selected && (
          <div>
            <div
              className="flex h-28 items-center justify-center text-5xl"
              style={{ background: `linear-gradient(135deg, ${selected.colorHex}55, ${theme.accentSoft})` }}
            >
              {selected.iconEmoji}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-display text-xl font-semibold text-white">{selected.name}</h3>
                <button onClick={closePanel} aria-label="Schließen" className="text-[#6b7396] hover:text-white">
                  ✕
                </button>
              </div>
              <p className="mt-1 text-sm text-[#8a92b8]">
                {tierForLevel(selected.level).emoji} Level {selected.level} · {selected.memberCount.toLocaleString("de-DE")} Mitglieder
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {selected.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-[#aab2d1]">
                    {t}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm italic leading-relaxed text-[#c4cae6]">„{selected.description}“</p>

              <div className="mt-5 flex flex-col gap-2">
                <Link
                  href={`/community/${selected.slug}`}
                  className="rounded-full py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ background: theme.accent, color: theme.accentSoft }}
                >
                  Community ansehen →
                </Link>
                <a
                  href={selected.inviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/15 py-2.5 text-center text-sm text-white hover:border-white/30"
                >
                  💬 Community beitreten
                </a>
              </div>
            </div>
          </div>
        )}

        {selectedEmptyPlot !== null && !selected && (
          <div className="p-5">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-xl font-semibold text-white">Dieser Platz ist noch frei</h3>
              <button onClick={closePanel} aria-label="Schließen" className="text-[#6b7396] hover:text-white">
                ✕
              </button>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-[#aab2d1]">
              Gründe hier deine Community in {land.name}. Sobald sie freigeschaltet ist, wächst
              ihre Stadt mit echter Discord-Aktivität — dafür braucht sie später nur unseren Bot
              auf eurem Server.
            </p>
            <Link
              href="/submit"
              className="mt-5 block rounded-full py-2.5 text-center text-sm font-semibold text-white hover:opacity-90"
              style={{ background: theme.accent, color: theme.accentSoft }}
            >
              🏙️ Community hier gründen
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
