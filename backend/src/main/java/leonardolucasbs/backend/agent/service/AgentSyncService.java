package leonardolucasbs.backend.agent.service;

import leonardolucasbs.backend.agent.mapper.AgentMapper;
import leonardolucasbs.backend.agent.enums.AgentSource;
import leonardolucasbs.backend.common.exception.BusinessException;
import leonardolucasbs.backend.external.dto.ExternalAgentResponseDTO;
import leonardolucasbs.backend.external.dto.ExternalAgentsResponseDTO;
import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.external.MediaApiClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AgentSyncService {

    private static final int PAGE_SIZE = 50;

    private final MediaApiClient mediaApiClient;
    private final AgentRepository agentRepository;
    private final AgentMapper agentMapper;

    @Transactional
    public void syncAgents() {
        try {
            int page = 0;
            String syncToken = null;
            boolean hasMorePages = true;

            while (hasMorePages) {
                ExternalAgentsResponseDTO response = mediaApiClient
                        .findAgents(page, PAGE_SIZE, syncToken)
                        .block();

                if (response == null || response.data() == null || response.data().isEmpty()) {
                    break;
                }

                for (ExternalAgentResponseDTO externalAgent : response.data()) {
                    saveOrUpdateAgent(externalAgent);
                }

                hasMorePages = response.data().size() == PAGE_SIZE;
                page++;
            }

            log.info("Agent synchronization completed successfully.");

        } catch (Exception exception) {
            log.error("Failed to synchronize agents: {}", exception.getMessage(), exception);
        }
    }

    private void saveOrUpdateAgent(ExternalAgentResponseDTO dto) {
        agentRepository.findById(dto.id())
                .ifPresentOrElse(
                        existingAgent -> updateExistingExternalAgent(existingAgent, dto),
                        () -> createExternalAgentOrDetectConflict(dto)
                );
    }

    private void updateExistingExternalAgent(Agent agent, ExternalAgentResponseDTO dto) {
        if (agent.getSource() == AgentSource.LOCAL) {
            log.warn("Skipping external update for local agent with id: {}", agent.getId());
            return;
        }

        if (isExternalDataOlder(agent, dto)) {
            log.warn("Skipping stale external update for agent with id: {}", agent.getId());
            return;
        }

        agentMapper.updateFromExternalResponse(agent, dto);
        agentRepository.save(agent);
    }

    private void createExternalAgentOrDetectConflict(ExternalAgentResponseDTO dto) {
        agentRepository.findByExternalId(dto.externalId())
                .ifPresent(conflictingAgent -> {
                    throw new BusinessException(
                            "External agent conflict detected. externalId already exists with another id: "
                                    + dto.externalId()
                    );
                });

        Agent agent = agentMapper.fromExternalResponse(dto);
        agentRepository.save(agent);
    }

    private boolean isExternalDataOlder(Agent agent, ExternalAgentResponseDTO dto) {
        return agent.getExternalUpdatedAt() != null
                && dto.updatedAt() != null
                && dto.updatedAt().isBefore(agent.getExternalUpdatedAt());
    }
}
