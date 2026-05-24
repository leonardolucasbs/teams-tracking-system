package leonardolucasbs.backend.checkin.dto;

import leonardolucasbs.backend.checkin.enums.CheckInOrigin;
import leonardolucasbs.backend.checkin.enums.CheckInType;

import java.time.Instant;
import java.util.UUID;

public record CheckInResponseDTO(
        UUID id,
        String agentId,
        String agentName,
        String externalCheckInId,
        String externalEventId,
        CheckInType type,
        CheckInOrigin origin,
        String source,
        Double latitude,
        Double longitude,
        String address,
        Double accuracy,
        Double speed,
        String notes,
        Double distanceFromPrevious,
        Instant occurredAt,
        Instant syncedAt,
        Instant createdAt,
        Instant updatedAt
) {
}
