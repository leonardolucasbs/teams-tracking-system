package leonardolucasbs.backend.location.service;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.external.MediaApiClient;
import leonardolucasbs.backend.external.dto.ExternalAgentLocationResponseDTO;
import leonardolucasbs.backend.external.dto.ExternalAgentLocationsResponseDTO;
import leonardolucasbs.backend.location.entity.AgentLocation;
import leonardolucasbs.backend.location.mapper.AgentLocationMapper;
import leonardolucasbs.backend.location.repository.AgentLocationRepository;
import leonardolucasbs.backend.sync.entity.SyncExecution;
import leonardolucasbs.backend.sync.enums.SyncType;
import leonardolucasbs.backend.sync.service.SyncExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgentLocationSyncService {

    private final MediaApiClient mediaApiClient;
    private final AgentRepository agentRepository;
    private final AgentLocationRepository locationRepository;
    private final AgentLocationMapper locationMapper;
    private final SyncExecutionService syncExecutionService;

    @Transactional
    public void syncLocations() {
        SyncExecution execution = syncExecutionService.start(SyncType.LOCATIONS);
        int itemsProcessed = 0;

        try {
            mediaApiClient.triggerLocationsSync().block();
            ExternalAgentLocationsResponseDTO response = mediaApiClient.findLocations().block();

            if (response == null || response.data() == null || response.data().isEmpty()) {
                syncExecutionService.markSuccess(execution.getId(), itemsProcessed, null);
                log.info("No external agent locations found to synchronize.");
                return;
            }

            Instant capturedAt = Instant.now().truncatedTo(ChronoUnit.MINUTES);

            for (ExternalAgentLocationResponseDTO externalLocation : response.data()) {
                if (saveLocationIfNotExists(externalLocation, capturedAt)) {
                    itemsProcessed++;
                }
            }

            syncExecutionService.markSuccess(execution.getId(), itemsProcessed, null);
            log.info("Agent locations synchronization completed successfully.");

        } catch (Exception exception) {
            syncExecutionService.markFailure(execution.getId(), exception.getMessage());
            log.error("Failed to synchronize agent locations: {}", exception.getMessage(), exception);
        }
    }

    private boolean saveLocationIfNotExists(ExternalAgentLocationResponseDTO dto, Instant capturedAt) {
        if (dto.accuracy() != null && dto.accuracy() > 50) {
            log.warn(
                    "Ignoring location because accuracy is greater than 50 meters. agentId={}, accuracy={}",
                    dto.agentId(),
                    dto.accuracy()
            );
            return false;
        }

        String locationId = locationMapper.generateLocationId(dto, capturedAt);

        if (locationRepository.existsById(locationId)) {
            return false;
        }

        Agent agent = agentRepository.findById(dto.agentId())
                .orElse(null);

        if (agent == null) {
            log.warn("Ignoring location because agent was not found. agentId={}", dto.agentId());
            return false;
        }

        AgentLocation location = locationMapper.fromExternalResponse(dto, agent, capturedAt);

        locationRepository.save(location);

        return true;
    }
}
