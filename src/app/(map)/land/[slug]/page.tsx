import { notFound } from "next/navigation";
import MapHeader from "@/components/MapHeader";
import LandMapView from "@/components/LandMapView";
import { getApprovedCommunitiesByLand } from "@/lib/queries";
import { landById, plotsForLand } from "@/lib/worldMap";

export default async function LandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const land = landById(slug);
  if (!land) notFound();

  const communities = await getApprovedCommunitiesByLand(slug);
  const plots = plotsForLand(slug);

  return (
    <div className="flex h-full flex-col">
      <MapHeader active="Karte" />
      <div className="relative flex-1">
        <LandMapView land={land} plots={plots} communities={communities} />
      </div>
    </div>
  );
}
