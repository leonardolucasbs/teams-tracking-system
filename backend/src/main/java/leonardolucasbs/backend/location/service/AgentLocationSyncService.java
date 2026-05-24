package leonardolucasbs.backend.location.service;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.external.MediaApiClient;
import leonardolucasbs.backend.external.dto.ExternalAgentLocationResponseDTO;
import leonardolucasbs.backend.external.dto.ExternalAgentLocationsResponseDTO;
import leonardolucasbs.backend.location.entity.AgentLocation;
import leonardolucasbs.backend.location.mapper.AgentLocationMapper;
import leonardolucasbs.backend.location.repository.AgentLocationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgentLocationSyncService {

    private static final int PAGE_SIZE = 50;

    private final MediaApiClient mediaApiClient;
    private final AgentRepository agentRepository;
    private final AgentLocationRepository locationRepository;
    private final AgentLocationMapper locationMapper;

    @Transactional
    public void syncLocations() {
        try {
            int page = 0;
            String syncToken = null;
            boolean hasMorePages = true;

            while (hasMorePages) {
                ExternalAgentLocationsResponseDTO response = mediaApiClient
                        .findLocations(page, PAGE_SIZE, syncToken)
                        .block();

                if (response == null || response.data() == null || response.data().isEmpty()) {
                    break;
                }

                for (ExternalAgentLocationResponseDTO externalLocation : response.data()) {
                    saveLocationIfNotExists(externalLocation);
                }

                hasMorePages = response.data().size() == PAGE_SIZE;
                page++;
            }

            log.info("Agent locations synchronization completed successfully.");

        } catch (Exception exception) {
            log.error("Failed to synchronize agent locations: {}", exception.getMessage(), exception);
        }
    }

    private void saveLocationIfNotExists(ExternalAgentLocationResponseDTO dto) {
        String locationId = locationMapper.generateLocationId(dto);

        if (locationRepository.existsById(locationId)) {
            return;
        }

        Agent agent = agentRepository.findById(dto.agentId())
                .orElse(null);

        if (agent == null) {
            log.warn("Ignoring location because agent was not found. agentId={}", dto.agentId());
            return;
        }

        AgentLocation location = locationMapper.fromExternalResponse(dto, agent);

        locationRepository.save(location);
    }
}
