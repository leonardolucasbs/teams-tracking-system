package leonardolucasbs.backend.agent.service;

import leonardolucasbs.backend.agent.mapper.AgentMapper;
import leonardolucasbs.backend.agent.enums.AgentSource;
import leonardolucasbs.backend.common.exception.BusinessException;
import leonardolucasbs.backend.external.dto.ExternalAgentResponseDTO;
import leonardolucasbs.backend.external.dto.ExternalAgentsResponseDTO;
import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.external.MediaApiClient;
import leonardolucasbs.backend.sync.entity.SyncExecution;
import leonardolucasbs.backend.sync.enums.SyncType;
import leonardolucasbs.backend.sync.service.SyncExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgentSyncService {

    private final MediaApiClient mediaApiClient;
    private final AgentRepository agentRepository;
    private final AgentMapper agentMapper;
    private final SyncExecutionService syncExecutionService;

    @Transactional
    public void syncAgents() {
        SyncExecution execution = syncExecutionService.start(SyncType.AGENTS);
        int itemsProcessed = 0;

        try {
            mediaApiClient.triggerAgentsSync().block();
            ExternalAgentsResponseDTO response = mediaApiClient.findAgents().block();

            if (response == null || response.data() == null || response.data().isEmpty()) {
                syncExecutionService.markSuccess(execution.getId(), itemsProcessed, null);
                log.info("No external agents found to synchronize.");
                return;
            }

            for (ExternalAgentResponseDTO externalAgent : response.data()) {
                if (saveOrUpdateAgent(externalAgent)) {
                    itemsProcessed++;
                }
            }

            syncExecutionService.markSuccess(execution.getId(), itemsProcessed, null);
            log.info("Agent synchronization completed successfully.");

        } catch (Exception exception) {
            syncExecutionService.markFailure(execution.getId(), exception.getMessage());
            log.error("Failed to synchronize agents: {}", exception.getMessage(), exception);
        }
    }

    private boolean saveOrUpdateAgent(ExternalAgentResponseDTO dto) {
        return agentRepository.findById(dto.id())
                .map(existingAgent -> updateExistingExternalAgent(existingAgent, dto))
                .orElseGet(() -> createExternalAgentOrDetectConflict(dto));
    }

    private boolean updateExistingExternalAgent(Agent agent, ExternalAgentResponseDTO dto) {
        if (agent.getSource() == AgentSource.LOCAL) {
            log.warn("Skipping external update for local agent with id: {}", agent.getId());
            return false;
        }

        if (isExternalDataOlder(agent, dto)) {
            log.warn("Skipping stale external update for agent with id: {}", agent.getId());
            return false;
        }

        agentMapper.updateFromExternalResponse(agent, dto);
        agentRepository.save(agent);

        return true;
    }

    private boolean createExternalAgentOrDetectConflict(ExternalAgentResponseDTO dto) {
        agentRepository.findByExternalId(dto.externalId())
                .ifPresent(conflictingAgent -> {
                    throw new BusinessException(
                            "External agent conflict detected. externalId already exists with another id: "
                                    + dto.externalId()
                    );
                });

        Agent agent = agentMapper.fromExternalResponse(dto);
        agentRepository.save(agent);

        return true;
    }

    private boolean isExternalDataOlder(Agent agent, ExternalAgentResponseDTO dto) {
        return agent.getExternalUpdatedAt() != null
                && dto.updatedAt() != null
                && dto.updatedAt().isBefore(agent.getExternalUpdatedAt());
    }
}
