package leonardolucasbs.backend.geofence.dto;

import leonardolucasbs.backend.geofence.enums.GeofenceType;

import java.time.Instant;

public record ExternalGeofenceResponseDTO(
        String id,
        String externalId,
        String name,
        GeofenceType type,
        String coordinatesJson,
        Boolean alertOnEnter,
        Boolean alertOnExit,
        String assignedTeams,
        Instant syncedAt
) {
}
