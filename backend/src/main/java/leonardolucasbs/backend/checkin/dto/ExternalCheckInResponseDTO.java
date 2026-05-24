package leonardolucasbs.backend.checkin.dto;

import leonardolucasbs.backend.checkin.enums.CheckInType;

import java.time.Instant;

public record ExternalCheckInResponseDTO(
        String id,
        String agentId,
        CheckInType type,
        String source,
        Double latitude,
        Double longitude,
        String address,
        Double accuracy,
        Double speed,
        String notes,
        Double distanceFromPrevious,
        String externalEventId,
        Instant occurredAt,
        Instant syncedAt
) {
}
