package leonardolucasbs.backend.external.dto;

import leonardolucasbs.backend.agent.enums.AgentStatus;

import java.time.Instant;

public record ExternalAgentLocationResponseDTO(
        String agentId,
        String externalId,
        String name,
        Double latitude,
        Double longitude,
        String currentAddress,
        Double accuracy,
        Double speed,
        Integer battery,
        AgentStatus status,
        Instant lastSeen
) {
}