"use client";

import dynamic from "next/dynamic";
import type { GeofenceMapWrapperProps } from "@/features/geofences/types/geofence-types";

const GeofenceMapClient = dynamic(
  () =>
    import("@/features/geofences/components/GeofenceMapClient").then(
      (module) => module.GeofenceMapClient,
    ),
  {
    ssr: false,
  },
);

export function GeofenceMapWrapper({ geofence }: GeofenceMapWrapperProps) {
  return <GeofenceMapClient geofence={geofence} />;
}
