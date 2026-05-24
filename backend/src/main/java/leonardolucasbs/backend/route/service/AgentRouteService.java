package leonardolucasbs.backend.route.service;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.common.exception.ResourceNotFoundException;
import leonardolucasbs.backend.common.geo.HaversineCalculator;
import leonardolucasbs.backend.location.entity.AgentLocation;
import leonardolucasbs.backend.location.repository.AgentLocationRepository;
import leonardolucasbs.backend.route.dto.AgentRoutePointDTO;
import leonardolucasbs.backend.route.dto.AgentRouteSummaryDTO;
import leonardolucasbs.backend.route.mapper.AgentRouteMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentRouteService {

    private final AgentRepository agentRepository;
    private final AgentLocationRepository agentLocationRepository;
    private final HaversineCalculator haversineCalculator;
    private final AgentRouteMapper agentRouteMapper;

    public AgentRouteSummaryDTO findTodayRouteByAgent(String agentId) {
        Agent agent = agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with id: " + agentId));

        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        Instant start = today.atStartOfDay(zone).toInstant();
        Instant end = today.plusDays(1).atStartOfDay(zone).toInstant();

        List<AgentLocation> locations = agentLocationRepository
                .findByAgentIdAndLastSeenBetweenOrderByLastSeenAsc(agentId, start, end);

        List<AgentRoutePointDTO> points = locations
                .stream()
                .map(agentRouteMapper::toPoint)
                .toList();

        return new AgentRouteSummaryDTO(
                agent.getId(),
                agent.getName(),
                today,
                points.size(),
                calculateTotalDistanceInKm(locations),
                getStartTime(locations),
                getEndTime(locations),
                points
        );
    }

    private Double calculateTotalDistanceInKm(List<AgentLocation> locations) {
        if (locations.size() < 2) {
            return 0.0;
        }

        double totalDistanceInKm = 0.0;

        for (int index = 1; index < locations.size(); index++) {
            AgentLocation previousLocation = locations.get(index - 1);
            AgentLocation currentLocation = locations.get(index);

            totalDistanceInKm += haversineCalculator.calculateDistanceInKm(
                    previousLocation.getLatitude(),
                    previousLocation.getLongitude(),
                    currentLocation.getLatitude(),
                    currentLocation.getLongitude()
            );
        }

        return BigDecimal.valueOf(totalDistanceInKm)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private Instant getStartTime(List<AgentLocation> locations) {
        if (locations.isEmpty()) {
            return null;
        }

        return locations.getFirst().getLastSeen();
    }

    private Instant getEndTime(List<AgentLocation> locations) {
        if (locations.isEmpty()) {
            return null;
        }

        return locations.getLast().getLastSeen();
    }
}
