package leonardolucasbs.backend.agent.mapper;

import leonardolucasbs.backend.agent.dto.AgentCreateRequestDTO;
import leonardolucasbs.backend.agent.dto.AgentResponseDTO;
import leonardolucasbs.backend.agent.dto.AgentUpdateRequestDTO;
import leonardolucasbs.backend.agent.enums.AgentSource;
import leonardolucasbs.backend.external.dto.ExternalAgentResponseDTO;
import leonardolucasbs.backend.agent.entity.Agent;
import org.springframework.stereotype.Component;

import java.util.UUID;
@Component
public final class AgentMapper {

    public static Agent fromExternalResponse(ExternalAgentResponseDTO dto) {
        return Agent.builder()
                .id(dto.id())
                .externalId(dto.externalId())
                .name(dto.name())
                .role(dto.role())
                .team(dto.team())
                .phone(dto.phone())
                .email(dto.email())
                .active(dto.active())
                .status(dto.status())
                .source(AgentSource.EXTERNAL_API)
                .battery(dto.battery())
                .lastSeen(dto.lastSeen())
                .externalCreatedAt(dto.createdAt())
                .externalUpdatedAt(dto.updatedAt())
                .build();
    }

    public static Agent fromCreateRequest(AgentCreateRequestDTO dto) {
        String localId = "local_" + UUID.randomUUID();

        return Agent.builder()
                .id(localId)
                .externalId(localId)
                .name(dto.name())
                .role(dto.role())
                .team(dto.team())
                .phone(dto.phone())
                .email(dto.email())
                .active(dto.active() != null ? dto.active() : true)
                .status(dto.status())
                .source(AgentSource.LOCAL)
                .battery(dto.battery())
                .lastSeen(null)
                .externalCreatedAt(null)
                .externalUpdatedAt(null)
                .build();
    }

    public AgentResponseDTO toResponse(Agent agent) {
        return new AgentResponseDTO(
                agent.getId(),
                agent.getExternalId(),
                agent.getName(),
                agent.getRole(),
                agent.getTeam(),
                agent.getPhone(),
                agent.getEmail(),
                agent.getActive(),
                agent.getStatus(),
                agent.getBattery(),
                agent.getLastSeen(),
                agent.getExternalCreatedAt(),
                agent.getExternalUpdatedAt()
        );
    }

    public static void updateFromRequest(Agent agent, AgentUpdateRequestDTO dto) {
        agent.setName(dto.name());
        agent.setRole(dto.role());
        agent.setTeam(dto.team());
        agent.setPhone(dto.phone());
        agent.setEmail(dto.email());
        agent.setActive(dto.active() != null ? dto.active() : agent.getActive());
        agent.setStatus(dto.status());
    }

    public static void updateFromExternalResponse(Agent agent, ExternalAgentResponseDTO dto) {
        agent.setExternalId(dto.externalId());
        agent.setName(dto.name());
        agent.setRole(dto.role());
        agent.setTeam(dto.team());
        agent.setPhone(dto.phone());
        agent.setEmail(dto.email());
        agent.setActive(dto.active());
        agent.setStatus(dto.status());
        agent.setSource(AgentSource.EXTERNAL_API);
        agent.setBattery(dto.battery());
        agent.setLastSeen(dto.lastSeen());
        agent.setExternalCreatedAt(dto.createdAt());
        agent.setExternalUpdatedAt(dto.updatedAt());
    }
}
