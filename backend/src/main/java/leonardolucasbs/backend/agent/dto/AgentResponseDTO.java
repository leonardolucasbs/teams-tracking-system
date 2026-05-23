package leonardolucasbs.backend.agent.dto;

import leonardolucasbs.backend.agent.enums.AgentRole;
import leonardolucasbs.backend.agent.enums.AgentStatus;

import java.time.Instant;

public record AgentResponseDTO(
        String id,
        String externalId,
        String name,
        AgentRole Role,
        String team,
        String phone,
        String email,
        Boolean active,
        AgentStatus status,
        int battery,
        Instant lastSeen,
        Instant createdAt,
        Instant updatedAt
) {

}
