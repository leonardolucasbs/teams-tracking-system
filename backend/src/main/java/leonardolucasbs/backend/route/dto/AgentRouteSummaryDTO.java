package leonardolucasbs.backend.route.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

public record AgentRouteSummaryDTO(
        String agentId,
        String agentName,
        LocalDate date,
        Integer totalPoints,
        Double totalDistanceInKm,
        Instant startTime,
        Instant endTime,
        List<AgentRoutePointDTO> points
) {
}
