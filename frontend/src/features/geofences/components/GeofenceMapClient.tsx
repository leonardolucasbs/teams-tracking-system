"use client";

import { Circle, CircleMarker, MapContainer, Polygon, TileLayer } from "react-leaflet";
import {
  DEFAULT_GEOFENCE_MAP_CENTER,
  DEFAULT_GEOFENCE_MAP_ZOOM,
  GEOFENCE_AREA_PATH_OPTIONS,
  GEOFENCE_MAP_TILE_ATTRIBUTION,
  GEOFENCE_MAP_TILE_URL,
  GEOFENCE_POINT_PATH_OPTIONS,
} from "@/features/geofences/constants/geofence-constants";
import type { GeofenceMapClientProps } from "@/features/geofences/types/geofence-types";
import {
  getGeofenceBounds,
  getGeofenceCenter,
  parseCoordinatesJson,
} from "@/features/geofences/utils/geofence-utils";

export function GeofenceMapClient({ geofence }: GeofenceMapClientProps) {
  const parsedCoordinates = parseCoordinatesJson(geofence);
  const center = getGeofenceCenter(parsedCoordinates);
  const bounds = getGeofenceBounds(parsedCoordinates);

  return (
    <section className="rounded-lg border border-border bg-white p-3">
      {parsedCoordinates.message ? (
        <p className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {parsedCoordinates.message}
        </p>
      ) : null}

      <MapContainer
        className="h-[360px] w-full rounded-md md:h-[500px]"
        center={center ?? DEFAULT_GEOFENCE_MAP_CENTER}
        zoom={DEFAULT_GEOFENCE_MAP_ZOOM}
        bounds={bounds ?? undefined}
        scrollWheelZoom
      >
        <TileLayer
          attribution={GEOFENCE_MAP_TILE_ATTRIBUTION}
          url={GEOFENCE_MAP_TILE_URL}
        />

        {parsedCoordinates.type === "POLYGON" && parsedCoordinates.polygon ? (
          <Polygon
            positions={parsedCoordinates.polygon}
            pathOptions={GEOFENCE_AREA_PATH_OPTIONS}
          />
        ) : null}

        {parsedCoordinates.type === "CIRCLE" &&
        parsedCoordinates.center &&
        parsedCoordinates.radius ? (
          <Circle
            center={parsedCoordinates.center}
            radius={parsedCoordinates.radius}
            pathOptions={GEOFENCE_AREA_PATH_OPTIONS}
          />
        ) : null}

        {parsedCoordinates.type === "POINT" && parsedCoordinates.center ? (
          <CircleMarker
            center={parsedCoordinates.center}
            radius={8}
            pathOptions={GEOFENCE_POINT_PATH_OPTIONS}
          />
        ) : null}
      </MapContainer>
    </section>
  );
}
