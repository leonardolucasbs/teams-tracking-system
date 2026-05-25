import { formatBrazilianDateTime } from "@/utils/format-date";
import { GEOFENCE_MESSAGES } from "@/features/geofences/constants/geofence-constants";
import type {
  Geofence,
  ParsedGeofenceCoordinates,
} from "@/features/geofences/types/geofence-types";

export function formatGeofenceDate(value?: string | null) {
  return formatBrazilianDateTime(value);
}

export function formatBooleanLabel(value: boolean) {
  return value ? "Sim" : "Não";
}

export function formatOptionalText(value?: string | null) {
  return value?.trim() ? value : "Não informado";
}

export function formatCoordinatesJson(value: string) {
  try {
    return JSON.stringify(JSON.parse(value), null, 2);
  } catch {
    return value;
  }
}

export function parseCoordinatesJson(geofence: Geofence): ParsedGeofenceCoordinates {
  try {
    const geoJson = parseJsonValue(geofence.coordinatesJson);
    return parseGeoJson(geoJson, geofence.type);
  } catch {
    return getInvalidCoordinatesResult();
  }
}

export function getGeofenceCenter(parsed: ParsedGeofenceCoordinates) {
  return parsed.center;
}

export function getGeofenceBounds(parsed: ParsedGeofenceCoordinates) {
  return parsed.bounds;
}

export function convertGeoJsonCoordinatesToLeaflet(
  coordinates: unknown,
): [number, number] | null {
  if (!Array.isArray(coordinates) || coordinates.length < 2) {
    return null;
  }

  const longitude = Number(coordinates[0]);
  const latitude = Number(coordinates[1]);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return [latitude, longitude];
}

export function isCircleGeofence(geofence: Geofence) {
  return geofence.type === "CIRCLE";
}

export function isPolygonGeofence(geofence: Geofence) {
  return geofence.type === "POLYGON";
}

function parseGeoJson(
  geoJson: unknown,
  geofenceType: Geofence["type"],
): ParsedGeofenceCoordinates {
  if (Array.isArray(geoJson)) {
    return parseCoordinatesArray(geoJson, geofenceType);
  }

  if (!isGeoJsonObject(geoJson)) {
    return getInvalidCoordinatesResult();
  }

  if (geoJson.type === "Feature") {
    return parseGeoJsonFeature(geoJson, geofenceType);
  }

  if (geoJson.type === "FeatureCollection") {
    const features = Array.isArray(geoJson.features) ? geoJson.features : [];
    const feature = features.find(isGeoJsonObject);
    return feature ? parseGeoJsonFeature(feature, geofenceType) : getInvalidCoordinatesResult();
  }

  if (isGeoJsonObject(geoJson.geometry)) {
    return parseGeoJsonGeometry(geoJson.geometry, geofenceType);
  }

  if (geoJson.coordinates) {
    return parseCoordinatesObject(geoJson, geofenceType);
  }

  if (geoJson.center || geoJson.latitude || geoJson.lat) {
    return parseCircleLikeObject(geoJson, geofenceType);
  }

  return parseGeoJsonGeometry(geoJson, geofenceType);
}

function parseGeoJsonFeature(
  feature: Record<string, unknown>,
  geofenceType: Geofence["type"],
) {
  if (!isGeoJsonObject(feature.geometry)) {
    return getInvalidCoordinatesResult();
  }

  const parsed = parseGeoJsonGeometry(feature.geometry, geofenceType);
  const radius = getRadiusFromProperties(feature.properties);

  if (parsed.type === "POINT" && geofenceType === "CIRCLE" && radius) {
    return {
      ...parsed,
      type: "CIRCLE" as const,
      radius,
      message: null,
    };
  }

  return parsed;
}

function parseGeoJsonGeometry(
  geometry: Record<string, unknown>,
  geofenceType: Geofence["type"],
): ParsedGeofenceCoordinates {
  if (geometry.type === "Polygon") {
    const polygon = parsePolygonCoordinates(geometry.coordinates);
    return polygon ? getPolygonCoordinatesResult(polygon) : getInvalidCoordinatesResult();
  }

  if (geometry.type === "MultiPolygon") {
    const firstPolygon = Array.isArray(geometry.coordinates)
      ? geometry.coordinates[0]
      : null;
    const polygon = parsePolygonCoordinates(firstPolygon);
    return polygon ? getPolygonCoordinatesResult(polygon) : getInvalidCoordinatesResult();
  }

  if (geometry.type === "Point") {
    const center = convertGeoJsonCoordinatesToLeaflet(geometry.coordinates);

    if (!center) {
      return getInvalidCoordinatesResult();
    }

    return {
      type: geofenceType === "CIRCLE" ? "POINT" : "POINT",
      center,
      bounds: null,
      polygon: null,
      radius: null,
      message:
        geofenceType === "CIRCLE" ? GEOFENCE_MESSAGES.missingRadius : null,
    };
  }

  return getInvalidCoordinatesResult();
}

function parseCoordinatesObject(
  value: Record<string, unknown>,
  geofenceType: Geofence["type"],
): ParsedGeofenceCoordinates {
  if (geofenceType === "CIRCLE") {
    const center = convertGeoJsonCoordinatesToLeaflet(value.coordinates);
    const radius = getRadiusFromProperties(value);

    if (!center) {
      return getInvalidCoordinatesResult();
    }

    return {
      type: radius ? "CIRCLE" as const : "POINT" as const,
      center,
      bounds: null,
      polygon: null,
      radius,
      message: radius ? null : GEOFENCE_MESSAGES.missingRadius,
    };
  }

  const polygon = parsePolygonCoordinates(value.coordinates)
    ?? parseFlatPolygonCoordinates(value.coordinates);

  return polygon ? getPolygonCoordinatesResult(polygon) : getInvalidCoordinatesResult();
}

function parseCircleLikeObject(
  value: Record<string, unknown>,
  geofenceType: Geofence["type"],
): ParsedGeofenceCoordinates {
  const center = convertGeoJsonCoordinatesToLeaflet(value.center)
    ?? convertObjectPointToLeaflet(value.center)
    ?? convertObjectPointToLeaflet(value);
  const radius = getRadiusFromProperties(value);

  if (!center) {
    return getInvalidCoordinatesResult();
  }

  return {
    type: geofenceType === "CIRCLE" && radius ? "CIRCLE" as const : "POINT" as const,
    center,
    bounds: null,
    polygon: null,
    radius,
    message: geofenceType === "CIRCLE" && !radius ? GEOFENCE_MESSAGES.missingRadius : null,
  };
}

function parseCoordinatesArray(
  coordinates: unknown[],
  geofenceType: Geofence["type"],
): ParsedGeofenceCoordinates {
  if (geofenceType === "CIRCLE") {
    const center = convertGeoJsonCoordinatesToLeaflet(coordinates);

    if (!center) {
      return getInvalidCoordinatesResult();
    }

    return {
      type: "POINT" as const,
      center,
      bounds: null,
      polygon: null,
      radius: null,
      message: GEOFENCE_MESSAGES.missingRadius,
    };
  }

  const polygon = parsePolygonCoordinates(coordinates)
    ?? parseFlatPolygonCoordinates(coordinates);

  return polygon ? getPolygonCoordinatesResult(polygon) : getInvalidCoordinatesResult();
}

function parsePolygonCoordinates(coordinates: unknown) {
  if (!Array.isArray(coordinates) || !Array.isArray(coordinates[0])) {
    return null;
  }

  const outerRing = coordinates[0]
    .map(convertGeoJsonCoordinatesToLeaflet)
    .filter(Boolean) as [number, number][];

  return outerRing.length >= 3 ? outerRing : null;
}

function parseFlatPolygonCoordinates(coordinates: unknown) {
  if (!Array.isArray(coordinates)) {
    return null;
  }

  const polygon = coordinates
    .map((coordinate) =>
      convertGeoJsonCoordinatesToLeaflet(coordinate)
      ?? convertObjectPointToLeaflet(coordinate),
    )
    .filter(Boolean) as [number, number][];

  return polygon.length >= 3 ? polygon : null;
}

function getPolygonCoordinatesResult(
  polygon: [number, number][],
): ParsedGeofenceCoordinates {
  return {
    type: "POLYGON",
    center: polygon[0],
    bounds: polygon,
    polygon,
    radius: null,
    message: null,
  };
}

function getInvalidCoordinatesResult(): ParsedGeofenceCoordinates {
  return {
    type: "INVALID",
    center: null,
    bounds: null,
    polygon: null,
    radius: null,
    message: GEOFENCE_MESSAGES.invalidCoordinates,
  };
}

function getRadiusFromProperties(properties: unknown) {
  if (!isGeoJsonObject(properties)) {
    return null;
  }

  const radius = Number(properties.radius ?? properties.radiusMeters ?? properties.radiusInMeters);

  return Number.isFinite(radius) && radius > 0 ? radius : null;
}

function isGeoJsonObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function convertObjectPointToLeaflet(value: unknown): [number, number] | null {
  if (!isGeoJsonObject(value)) {
    return null;
  }

  const latitude = Number(value.latitude ?? value.lat);
  const longitude = Number(value.longitude ?? value.lng ?? value.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return [latitude, longitude];
}

function parseJsonValue(value: string): unknown {
  let parsed: unknown = value;

  for (let index = 0; index < 3; index++) {
    if (typeof parsed !== "string") {
      return parsed;
    }

    parsed = JSON.parse(parsed);
  }

  return parsed;
}
