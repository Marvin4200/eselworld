"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HUB_SHAPE,
  HUB_WORLD_SCALE,
  HUB_WORLD_X,
  HUB_WORLD_Y,
  LANDS,
  WORLD_VIEW_H,
  WORLD_VIEW_W,
} from "@/lib/worldMap";
import type { CommunitySummary } from "@/lib/types";

const MIN_SCALE = 0.55;
const MAX_SCALE = 2.5;
const LOCAL_CENTER = 700;
const LOCAL_RADIUS = 540;

type Props = {
  landCounts: Record<string, number>;
  stats: { communityCount: number; memberCount: number };
  spotlight: CommunitySummary | null;
};

export default function WorldMapView({ landCounts, stats, spotlight }: Props) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const [hovered, setHovered] = useState<string | null>(null);
  const [hiddenLands, setHiddenLands] = useState<Set<string>>(new Set());
  const [filterOpen, setFilterOpen] = useState(true);
  const dragRef = useRef<{
    dragging: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);

  function toViewCoords(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (WORLD_VIEW_W / rect.width),
      y: (clientY - rect.top) * (WORLD_VIEW_H / rect.height),
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
      x: drag.origX + (e.clientX - drag.startX) * (WORLD_VIEW_W / rect.width),
      y: drag.origY + (e.clientY - drag.startY) * (WORLD_VIEW_H / rect.height),
    }));
  }

  function endDrag() {
    if (dragRef.current) dragRef.current.dragging = false;
  }

  function resetView() {
    setView({ x: 0, y: 0, scale: 1 });
  }

  function goToLand(id: string) {
    if (dragRef.current?.moved) return;
    router.push(`/land/${id}`);
  }

  function toggleLand(id: string) {
    setHiddenLands((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="relative h-full w-full bg-[#0a0e1a]">
      {/* stat pills */}
      <div className="pointer-events-none absolute left-4 top-4 z-20 flex gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0f1526]/90 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[#3fd6c8]" />
          <strong className="font-semibold">{stats.communityCount.toLocaleString("de-DE")}</strong>
          <span className="text-[#aab2d1]">Communities entdeckt</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#0f1526]/90 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur">
          👥
          <strong className="font-semibold">{stats.memberCount.toLocaleString("de-DE")}</strong>
          <span className="text-[#aab2d1]">aktive Mitglieder</span>
        </div>
      </div>

      {/* spotlight */}
      {spotlight && (
        <Link
          href={`/community/${spotlight.slug}`}
          className="absolute right-4 top-4 z-20 flex max-w-[15rem] items-center gap-2.5 rounded-full border border-white/10 bg-[#0f1526]/90 py-1.5 pl-1.5 pr-4 text-xs text-white shadow-lg backdrop-blur transition hover:border-[#3fd6c8]/50"
        >
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-base"
            style={{ backgroundColor: `${spotlight.colorHex}33` }}
          >
            {spotlight.iconEmoji}
          </span>
          <span className="min-w-0">
            <span className="block text-[10px] uppercase tracking-wide text-[#6b7396]">
              🌟 Rasantester Aufstieg
            </span>
            <span className="block truncate font-medium">
              {spotlight.name}{" "}
              <span className="text-[#3fd6c8]">+{spotlight.growthPercent.toFixed(0)}%</span>
            </span>
          </span>
        </Link>
      )}

      {/* category filter panel */}
      <div className="absolute bottom-4 left-4 z-20 w-56 rounded-2xl border border-white/10 bg-[#0f1526]/95 p-3 text-xs shadow-xl backdrop-blur">
        <button
          onClick={() => setFilterOpen((o) => !o)}
          className="flex w-full items-center justify-between font-medium text-white"
        >
          Länder anzeigen
          <span className="text-[#6b7396]">{filterOpen ? "▾" : "▸"}</span>
        </button>
        {filterOpen && (
          <div className="mt-2 grid grid-cols-1 gap-1">
            {LANDS.map((land) => (
              <label
                key={land.id}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-1.5 py-1 text-[#aab2d1] hover:bg-white/5"
              >
                <input
                  type="checkbox"
                  checked={!hiddenLands.has(land.id)}
                  onChange={() => toggleLand(land.id)}
                  className="accent-[#3fd6c8]"
                />
                <span>{land.icon}</span>
                {land.name}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* zoom + compass */}
      <div className="absolute bottom-4 right-4 z-20 flex items-end gap-3">
        <svg width="54" height="54" viewBox="0 0 54 54" className="opacity-70">
          <circle cx="27" cy="27" r="25" fill="none" stroke="#3fd6c8" strokeOpacity="0.4" />
          <text x="27" y="12" textAnchor="middle" fontSize="9" fill="#aab2d1">N</text>
          <text x="27" y="47" textAnchor="middle" fontSize="9" fill="#aab2d1">S</text>
          <text x="6" y="30" textAnchor="middle" fontSize="9" fill="#aab2d1">W</text>
          <text x="48" y="30" textAnchor="middle" fontSize="9" fill="#aab2d1">O</text>
          <line x1="27" y1="10" x2="27" y2="44" stroke="#3fd6c8" strokeOpacity="0.5" />
          <line x1="10" y1="27" x2="44" y2="27" stroke="#3fd6c8" strokeOpacity="0.5" />
        </svg>
        <div className="flex flex-col gap-1.5">
          <button
            aria-label="Vergrößern"
            onClick={() => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1.25)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#0f1526] text-lg text-white shadow hover:border-[#3fd6c8]/50"
          >
            +
          </button>
          <button
            aria-label="Verkleinern"
            onClick={() => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 0.8)}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#0f1526] text-lg text-white shadow hover:border-[#3fd6c8]/50"
          >
            −
          </button>
          <button
            aria-label="Ansicht zurücksetzen"
            onClick={resetView}
            className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-[#0f1526] text-xs text-[#aab2d1] shadow hover:border-[#3fd6c8]/50"
          >
            🗺️
          </button>
        </div>
      </div>

      <p className="pointer-events-none absolute bottom-4 left-1/2 z-10 hidden -translate-x-1/2 text-[11px] tracking-[0.2em] text-white/30 sm:block">
        KLEINE COMMUNITIES. GROSSE GESCHICHTEN.
      </p>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${WORLD_VIEW_W} ${WORLD_VIEW_H}`}
        className="h-full w-full touch-none cursor-grab active:cursor-grabbing"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        role="img"
        aria-label="Weltkarte von EselWorld mit acht Ländern"
      >
        <defs>
          <radialGradient id="ocean" cx="50%" cy="42%" r="75%">
            <stop offset="0%" stopColor="#12314a" />
            <stop offset="100%" stopColor="#050a14" />
          </radialGradient>
          <pattern id="world-sparkle" width="34" height="34" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.3" fill="#3fd6c8" opacity="0.18" />
          </pattern>
          <filter id="cloud-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>
        <rect x="0" y="0" width={WORLD_VIEW_W} height={WORLD_VIEW_H} fill="url(#ocean)" />
        <rect
          x="0"
          y="0"
          width={WORLD_VIEW_W}
          height={WORLD_VIEW_H}
          fill="url(#world-sparkle)"
          className="map-water-glimmer"
        />

        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
          {/* center hub */}
          <g
            transform={`translate(${HUB_WORLD_X - 150 * HUB_WORLD_SCALE} ${HUB_WORLD_Y - 150 * HUB_WORLD_SCALE}) scale(${HUB_WORLD_SCALE})`}
          >
            <circle cx="150" cy="150" r="140" fill="#3fd6c8" className="map-pulse-glow" style={{ pointerEvents: "none" }} />
            <path d={HUB_SHAPE} fill="#d8cba3" stroke="#8a7a52" strokeWidth={4} />
            <text x="150" y="140" textAnchor="middle" fontSize="34" style={{ pointerEvents: "none" }}>
              🫏
            </text>
            <text
              x="150"
              y="200"
              textAnchor="middle"
              fontSize="20"
              fontWeight={700}
              fill="#2b2313"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ESELWORLD
            </text>
          </g>

          {LANDS.map((land) => {
            const tx = land.worldX - LOCAL_CENTER * land.worldScale;
            const ty = land.worldY - LOCAL_CENTER * land.worldScale;
            const isHidden = hiddenLands.has(land.id);
            const isHovered = hovered === land.id;
            const count = landCounts[land.id] ?? 0;

            return (
              <g
                key={land.id}
                opacity={isHidden ? 0.25 : 1}
                style={{ transition: "opacity 0.25s" }}
              >
                <g
                  transform={`translate(${tx} ${ty}) scale(${land.worldScale * (isHovered ? 1.03 : 1)})`}
                  onClick={() => goToLand(land.id)}
                  onPointerEnter={() => setHovered(land.id)}
                  onPointerLeave={() => setHovered(null)}
                  className="cursor-pointer"
                  style={{ transition: "transform 0.2s" }}
                >
                  {isHovered && (
                    <path
                      d={land.shape}
                      fill="none"
                      stroke={land.theme.accent}
                      strokeWidth={14}
                      opacity={0.35}
                    />
                  )}
                  <path
                    d={land.shape}
                    fill="none"
                    stroke={land.theme.accentSoft}
                    strokeWidth={26}
                    strokeLinejoin="round"
                  />
                  <path
                    d={land.shape}
                    fill={land.theme.land}
                    stroke={land.theme.landLine}
                    strokeWidth={3}
                  />
                  <text
                    x={LOCAL_CENTER}
                    y={LOCAL_CENTER - 10}
                    textAnchor="middle"
                    fontSize={90}
                    style={{ pointerEvents: "none" }}
                  >
                    {land.icon}
                  </text>
                </g>

                {/* label pill (screen-space sized, independent of land scale) */}
                <g
                  transform={`translate(${land.worldX} ${land.worldY + LOCAL_RADIUS * land.worldScale * 0.62})`}
                  onClick={() => goToLand(land.id)}
                  className="cursor-pointer"
                >
                  <rect
                    x={-125}
                    y={0}
                    width={250}
                    height={54}
                    rx={16}
                    fill="#0f1526"
                    fillOpacity={0.92}
                    stroke={land.theme.accent}
                    strokeWidth={1.5}
                  />
                  <text
                    x={-107}
                    y={23}
                    fontSize={16}
                    fontWeight={700}
                    fill="#ffffff"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {land.icon} {land.name}
                  </text>
                  <text
                    x={-107}
                    y={41}
                    fontSize={10.5}
                    fill="#8a92b8"
                    style={{ fontFamily: "var(--font-sans)" }}
                  >
                    {land.subtitle}
                  </text>
                  {count > 0 && (
                    <text
                      x={112}
                      y={31}
                      textAnchor="end"
                      fontSize={11}
                      fontWeight={700}
                      fill={land.theme.accent}
                      style={{ fontFamily: "var(--font-sans)" }}
                    >
                      {count}
                    </text>
                  )}
                </g>
              </g>
            );
          })}
        </g>

        {/* treibende Wolken — atmosphärische Deko, unabhängig vom Zoom */}
        <g style={{ pointerEvents: "none" }} opacity={0.5}>
          <ellipse cx={260} cy={200} rx={140} ry={40} fill="#ffffff" filter="url(#cloud-blur)" className="map-cloud-drift" />
          <ellipse cx={1300} cy={150} rx={170} ry={46} fill="#ffffff" filter="url(#cloud-blur)" className="map-cloud-drift-slow" />
          <ellipse cx={900} cy={1000} rx={200} ry={50} fill="#ffffff" filter="url(#cloud-blur)" className="map-cloud-drift" style={{ animationDelay: "-20s" }} />
        </g>
      </svg>
    </div>
  );
}
