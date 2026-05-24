package leonardolucasbs.backend.checkin.service;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.enums.AgentRole;
import leonardolucasbs.backend.agent.enums.AgentStatus;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.checkin.dto.CheckInCreateRequestDTO;
import leonardolucasbs.backend.checkin.dto.CheckInResponseDTO;
import leonardolucasbs.backend.checkin.entity.CheckIn;
import leonardolucasbs.backend.checkin.enums.CheckInOrigin;
import leonardolucasbs.backend.checkin.enums.CheckInType;
import leonardolucasbs.backend.checkin.mapper.CheckInMapper;
import leonardolucasbs.backend.checkin.repository.CheckInRepository;
import leonardolucasbs.backend.common.exception.ResourceNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CheckInServiceTest {

    @Mock
    private CheckInRepository checkInRepository;

    @Mock
    private AgentRepository agentRepository;

    @Spy
    private CheckInMapper checkInMapper;

    @InjectMocks
    private CheckInService checkInService;

    @Test
    void createShouldSaveManualCheckIn() {
        Agent agent = buildAgent();
        CheckInCreateRequestDTO request = new CheckInCreateRequestDTO(
                agent.getId(),
                CheckInType.CHECKIN,
                -23.5629,
                -46.6544,
                "Rua da Consolacao, 500 - Sao Paulo, SP",
                12.0,
                0.0,
                "Manual check-in",
                Instant.parse("2026-05-24T10:00:00Z")
        );
        when(agentRepository.findById(agent.getId())).thenReturn(Optional.of(agent));
        when(checkInRepository.save(any(CheckIn.class))).thenAnswer(invocation -> {
            CheckIn checkIn = invocation.getArgument(0);
            checkIn.setId(UUID.randomUUID());
            checkIn.setCreatedAt(Instant.parse("2026-05-24T10:00:01Z"));
            checkIn.setUpdatedAt(Instant.parse("2026-05-24T10:00:01Z"));
            return checkIn;
        });

        CheckInResponseDTO response = checkInService.create(request);

        assertThat(response.id()).isNotNull();
        assertThat(response.agentId()).isEqualTo(agent.getId());
        assertThat(response.origin()).isEqualTo(CheckInOrigin.LOCAL);
        assertThat(response.source()).isEqualTo("MANUAL");
        assertThat(response.type()).isEqualTo(CheckInType.CHECKIN);
        assertThat(response.occurredAt()).isEqualTo(request.occurredAt());
    }

    @Test
    void createShouldThrowWhenAgentDoesNotExist() {
        CheckInCreateRequestDTO request = new CheckInCreateRequestDTO(
                "missing_agent",
                CheckInType.CHECKIN,
                -23.5629,
                -46.6544,
                null,
                null,
                null,
                null,
                null
        );
        when(agentRepository.findById(request.agentId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> checkInService.create(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Agent not found with id: " + request.agentId());
    }

    @Test
    void findByAgentShouldReturnCheckInsFromAgent() {
        Agent agent = buildAgent();
        CheckIn checkIn = buildCheckIn(agent, Instant.parse("2026-05-24T10:00:00Z"));
        when(agentRepository.findById(agent.getId())).thenReturn(Optional.of(agent));
        when(checkInRepository.findByAgentIdOrderByOccurredAtDesc(agent.getId())).thenReturn(List.of(checkIn));

        List<CheckInResponseDTO> response = checkInService.findByAgent(agent.getId());

        assertThat(response).hasSize(1);
        assertThat(response.getFirst().agentId()).isEqualTo(agent.getId());
    }

    @Test
    void findTodayByAgentShouldReturnCheckInsFromCurrentDay() {
        Agent agent = buildAgent();
        CheckIn checkIn = buildCheckIn(agent, Instant.parse("2026-05-24T10:00:00Z"));
        when(agentRepository.findById(agent.getId())).thenReturn(Optional.of(agent));
        when(checkInRepository.findByAgentIdAndOccurredAtBetweenOrderByOccurredAtAsc(
                eq(agent.getId()),
                any(Instant.class),
                any(Instant.class)
        )).thenReturn(List.of(checkIn));

        List<CheckInResponseDTO> response = checkInService.findTodayByAgent(agent.getId());

        assertThat(response).hasSize(1);
        assertThat(response.getFirst().occurredAt()).isEqualTo(checkIn.getOccurredAt());
    }

    private Agent buildAgent() {
        return Agent.builder()
                .id("seed_agent_002")
                .externalId("ext-agent-002")
                .name("Ana Rodrigues")
                .role(AgentRole.TECHNICIAN)
                .team("Equipe Norte")
                .active(true)
                .status(AgentStatus.ONLINE)
                .battery(62)
                .build();
    }

    private CheckIn buildCheckIn(Agent agent, Instant occurredAt) {
        return CheckIn.builder()
                .id(UUID.randomUUID())
                .agent(agent)
                .type(CheckInType.CHECKIN)
                .origin(CheckInOrigin.LOCAL)
                .source("MANUAL")
                .latitude(-23.5629)
                .longitude(-46.6544)
                .occurredAt(occurredAt)
                .createdAt(occurredAt)
                .updatedAt(occurredAt)
                .build();
    }
}
