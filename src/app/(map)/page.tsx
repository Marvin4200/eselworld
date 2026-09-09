import MapHeader from "@/components/MapHeader";
import WorldMapView from "@/components/WorldMapView";
import { getLandCommunityCounts, getSpotlightCommunity, getWorldStats } from "@/lib/queries";

export default async function WorldPage() {
  const [landCounts, stats, spotlight] = await Promise.all([
    getLandCommunityCounts(),
    getWorldStats(),
    getSpotlightCommunity(),
  ]);

  return (
    <div className="flex h-full flex-col">
      <MapHeader active="Karte" />
      <div className="relative flex-1">
        <WorldMapView landCounts={landCounts} stats={stats} spotlight={spotlight} />
      </div>
    </div>
  );
}
