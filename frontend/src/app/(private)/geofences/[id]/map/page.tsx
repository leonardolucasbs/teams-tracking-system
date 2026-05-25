import { GeofenceMapPage } from "@/features/geofences/components/GeofenceMapPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <GeofenceMapPage id={id} />;
}
