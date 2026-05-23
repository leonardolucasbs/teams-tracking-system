package leonardolucasbs.backend.agent.service;

import leonardolucasbs.backend.agent.dto.AgentCreateRequestDTO;
import leonardolucasbs.backend.agent.dto.AgentUpdateRequestDTO;
import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.enums.AgentStatus;
import leonardolucasbs.backend.agent.mapper.AgentMapper;
import leonardolucasbs.backend.agent.dto.AgentResponseDTO;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.common.exception.BusinessException;
import leonardolucasbs.backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgentService {

    private final AgentRepository agentRepository;
    private final AgentMapper agentMapper;

    public AgentResponseDTO create(AgentCreateRequestDTO dto) {
        Agent agent = agentMapper.fromCreateRequest(dto);

        if (agentRepository.existsById(agent.getId())) {
            throw new BusinessException("Agent already exists with id: " + agent.getId());
        }

        if (agentRepository.existsByExternalId(agent.getExternalId())) {
            throw new BusinessException("Agent already exists with externalId: " + agent.getExternalId());
        }

        Agent savedAgent = agentRepository.save(agent);

        return agentMapper.toResponse(savedAgent);
    }

    public List<AgentResponseDTO> findAll() {
        List<Agent> agents = agentRepository.findAll();
        ensureAgentsFound(agents, "No agents found.");

        return agents
                .stream()
                .map(agentMapper::toResponse)
                .toList();
    }

    public AgentResponseDTO findById(String id) {
        Agent agent = findAgentById(id);

        return agentMapper.toResponse(agent);
    }

    public List<AgentResponseDTO> findByStatus(AgentStatus status) {
        List<Agent> agents = agentRepository.findByStatus(status);
        ensureAgentsFound(agents, "No agents found with status: " + status);

        return agents
                .stream()
                .map(agentMapper::toResponse)
                .toList();
    }

    public List<AgentResponseDTO> findByTeam(String team) {
        List<Agent> agents = agentRepository.findByTeamIgnoreCase(team);
        ensureAgentsFound(agents, "No agents found for team: " + team);

        return agents
                .stream()
                .map(agentMapper::toResponse)
                .toList();
    }

    public List<AgentResponseDTO> findActiveAgents() {
        List<Agent> agents = agentRepository.findByActiveTrue();
        ensureAgentsFound(agents, "No active agents found.");

        return agents
                .stream()
                .map(agentMapper::toResponse)
                .toList();
    }

    public AgentResponseDTO update(String id, AgentUpdateRequestDTO dto) {
        Agent agent = findAgentById(id);

        agentMapper.updateFromRequest(agent, dto);

        Agent updatedAgent = agentRepository.save(agent);

        return agentMapper.toResponse(updatedAgent);
    }

    public AgentResponseDTO updateStatus(String id, AgentStatus status) {
        Agent agent = findAgentById(id);

        if (!agent.getActive() && status == AgentStatus.ONLINE) {
            throw new BusinessException("Inactive agents cannot be set to ONLINE status.");
        }

        agent.setStatus(status);

        Agent updatedAgent = agentRepository.save(agent);

        return agentMapper.toResponse(updatedAgent);
    }

    public AgentResponseDTO activate(String id) {
        Agent agent = findAgentById(id);

        if (Boolean.TRUE.equals(agent.getActive())) {
            throw new BusinessException("Agent is already active.");
        }

        agent.setActive(true);

        Agent updatedAgent = agentRepository.save(agent);

        return agentMapper.toResponse(updatedAgent);
    }

    public AgentResponseDTO deactivate(String id) {
        Agent agent = findAgentById(id);

        if (Boolean.FALSE.equals(agent.getActive())) {
            throw new BusinessException("Agent is already inactive.");
        }

        agent.setActive(false);
        agent.setStatus(AgentStatus.OFFLINE);

        Agent updatedAgent = agentRepository.save(agent);

        return agentMapper.toResponse(updatedAgent);
    }

    public void delete(String id) {
        Agent agent = findAgentById(id);

        agentRepository.delete(agent);
    }

    private Agent findAgentById(String id) {
        return agentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with id: " + id));
    }

    private void ensureAgentsFound(List<Agent> agents, String message) {
        if (agents.isEmpty()) {
            throw new ResourceNotFoundException(message);
        }
    }
}
