package leonardolucasbs.backend.agent.dto;

import leonardolucasbs.backend.agent.enums.AgentRole;
import leonardolucasbs.backend.agent.enums.AgentStatus;

import java.time.Instant;

public record ExternalAgentResponseDTO(
        String id,
        String externalId,
        String name,
        AgentRole role,
        String team,
        String phone,
        String email,
        Boolean active,
        AgentStatus status,
        Integer battery,
        Instant lastSeen,
        Instant createdAt,
        Instant updatedAt
) {
}
