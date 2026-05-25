import type { CoordinatesJsonBlockProps } from "@/features/geofences/types/geofence-types";
import { formatCoordinatesJson } from "@/features/geofences/utils/geofence-utils";

export function CoordinatesJsonBlock({ value }: CoordinatesJsonBlockProps) {
  return (
    <details className="max-w-80">
      <summary className="cursor-pointer text-sm font-medium text-foreground underline-offset-4 hover:underline">
        Ver coordenadas
      </summary>
      <pre className="mt-2 max-h-56 overflow-auto rounded-md border border-border bg-zinc-50 p-3 text-xs text-foreground">
        {formatCoordinatesJson(value)}
      </pre>
    </details>
  );
}
