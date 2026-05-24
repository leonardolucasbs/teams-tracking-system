package leonardolucasbs.backend.route.dto;

import leonardolucasbs.backend.agent.enums.AgentStatus;

import java.time.Instant;

public record AgentRoutePointDTO(
        String locationId,
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
