type Point = { date: Date; xpAwarded: number; uniqueActiveMembers: number };

export default function ActivitySparkline({ points }: { points: Point[] }) {
  if (points.length === 0) {
    return (
      <p className="text-xs text-ink-faint">
        Noch keine Aktivitätstage aufgezeichnet.
      </p>
    );
  }

  const max = Math.max(...points.map((p) => p.xpAwarded), 1);

  return (
    <div className="flex h-16 items-end gap-1">
      {points.map((p, i) => (
        <div
          key={i}
          title={`${p.date.toLocaleDateString("de-DE")}: ${Math.round(p.xpAwarded)} XP · ${p.uniqueActiveMembers} aktive Mitglieder`}
          className="flex-1 rounded-t bg-teal/70 transition hover:bg-teal"
          style={{ height: `${Math.max(6, (p.xpAwarded / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}
