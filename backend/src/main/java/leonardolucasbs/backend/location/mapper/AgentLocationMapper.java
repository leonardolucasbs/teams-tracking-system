package leonardolucasbs.backend.location.mapper;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.external.dto.ExternalAgentLocationResponseDTO;
import leonardolucasbs.backend.location.dto.AgentLocationResponseDTO;
import leonardolucasbs.backend.location.entity.AgentLocation;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.UUID;

@Component
public class AgentLocationMapper {

    public AgentLocation fromExternalResponse(
            ExternalAgentLocationResponseDTO dto,
            Agent agent
    ) {
        return fromExternalResponse(dto, agent, dto.lastSeen());
    }

    public AgentLocation fromExternalResponse(
            ExternalAgentLocationResponseDTO dto,
            Agent agent,
            Instant capturedAt
    ) {
        return AgentLocation.builder()
                .id(generateLocationId(dto, capturedAt))
                .agent(agent)
                .externalId(dto.externalId())
                .agentName(dto.name())
                .latitude(dto.latitude())
                .longitude(dto.longitude())
                .currentAddress(dto.currentAddress())
                .accuracy(dto.accuracy())
                .speed(dto.speed())
                .battery(dto.battery())
                .status(dto.status())
                .lastSeen(capturedAt)
                .build();
    }

    public AgentLocationResponseDTO toResponse(AgentLocation location) {
        return new AgentLocationResponseDTO(
                location.getId(),
                location.getAgent().getId(),
                location.getExternalId(),
                location.getAgentName(),
                location.getLatitude(),
                location.getLongitude(),
                location.getCurrentAddress(),
                location.getAccuracy(),
                location.getSpeed(),
                location.getBattery(),
                location.getStatus(),
                location.getLastSeen(),
                location.getCreatedAt(),
                location.getUpdatedAt()
        );
    }

    public String generateLocationId(ExternalAgentLocationResponseDTO dto) {
        return generateLocationId(dto, dto.lastSeen());
    }

    public String generateLocationId(ExternalAgentLocationResponseDTO dto, Instant capturedAt) {
        String rawId = dto.agentId()
                + "|"
                + capturedAt
                + "|"
                + dto.latitude()
                + "|"
                + dto.longitude();

        UUID uuid = UUID.nameUUIDFromBytes(rawId.getBytes(StandardCharsets.UTF_8));

        return "loc_" + uuid;
    }
}
