package leonardolucasbs.backend.location.service;

import leonardolucasbs.backend.common.exception.ResourceNotFoundException;
import leonardolucasbs.backend.location.dto.AgentLocationResponseDTO;
import leonardolucasbs.backend.location.entity.AgentLocation;
import leonardolucasbs.backend.location.mapper.AgentLocationMapper;
import leonardolucasbs.backend.location.repository.AgentLocationRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

@Service
@AllArgsConstructor
public class AgentLocationService {

    private final AgentLocationRepository agentLocationRepository;
    private final AgentLocationMapper agentLocationMapper;

    public AgentLocationResponseDTO findById(String id) {
        AgentLocation location = agentLocationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent location not found with id: " + id));

        return agentLocationMapper.toResponse(location);
    }

    public List<AgentLocationResponseDTO> findByAgent(String agentId) {
        List<AgentLocation> locations = agentLocationRepository.findByAgentIdOrderByLastSeenAsc(agentId);
        ensureLocationsFound(locations, "No locations found for agent id: " + agentId);

        return locations
                .stream()
                .map(agentLocationMapper::toResponse)
                .toList();
    }

    public List<AgentLocationResponseDTO> findTodayRouteByAgent(String agentId) {
        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        Instant start = today.atStartOfDay(zone).toInstant();
        Instant end = today.plusDays(1).atStartOfDay(zone).toInstant();

        List<AgentLocation> locations = agentLocationRepository
                .findByAgentIdAndLastSeenBetweenOrderByLastSeenAsc(agentId, start, end);
        ensureLocationsFound(locations, "No locations found today for agent id: " + agentId);

        return locations
                .stream()
                .map(agentLocationMapper::toResponse)
                .toList();
    }

    private void ensureLocationsFound(List<AgentLocation> locations, String message) {
        if (locations.isEmpty()) {
            throw new ResourceNotFoundException(message);
        }
    }
}
