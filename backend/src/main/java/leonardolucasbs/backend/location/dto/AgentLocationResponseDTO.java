package leonardolucasbs.backend.location.dto;

import leonardolucasbs.backend.agent.enums.AgentStatus;

import java.time.Instant;

public record AgentLocationResponseDTO(
        String id,
        String agentId,
        String externalId,
        String agentName,
        Double latitude,
        Double longitude,
        String currentAddress,
        Double accuracy,
        Double speed,
        Integer battery,
        AgentStatus status,
        Instant lastSeen,
        Instant createdAt,
        Instant updatedAt
) {
}