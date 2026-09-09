// Die Karten-Erlebnis-Seiten (Weltkarte, Land-Karte) bringen ihr eigenes,
// immer-dunkles Chrome mit (MapHeader) statt des normalen Site-Headers —
// deshalb kein gemeinsames Layout mit (site).
export default function MapLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-dvh w-full overflow-hidden">{children}</div>;
}
