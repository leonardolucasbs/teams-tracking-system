package leonardolucasbs.backend.checkin.service;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.enums.AgentRole;
import leonardolucasbs.backend.agent.enums.AgentStatus;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.checkin.dto.ExternalCheckInResponseDTO;
import leonardolucasbs.backend.checkin.dto.ExternalCheckInsResponseDTO;
import leonardolucasbs.backend.checkin.entity.CheckIn;
import leonardolucasbs.backend.checkin.enums.CheckInOrigin;
import leonardolucasbs.backend.checkin.enums.CheckInType;
import leonardolucasbs.backend.checkin.mapper.CheckInMapper;
import leonardolucasbs.backend.checkin.repository.CheckInRepository;
import leonardolucasbs.backend.common.exception.BusinessException;
import leonardolucasbs.backend.external.MediaApiClient;
import leonardolucasbs.backend.sync.entity.SyncExecution;
import leonardolucasbs.backend.sync.enums.SyncType;
import leonardolucasbs.backend.sync.service.SyncExecutionService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import reactor.core.publisher.Mono;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CheckInSyncServiceTest {

    @Mock
    private MediaApiClient mediaApiClient;

    @Mock
    private AgentRepository agentRepository;

    @Mock
    private CheckInRepository checkInRepository;

    @Spy
    private CheckInMapper checkInMapper;

    @Mock
    private SyncExecutionService syncExecutionService;

    @InjectMocks
    private CheckInSyncService checkInSyncService;

    @Test
    void syncCheckInsShouldCreateExternalCheckInWithoutDuplicate() {
        Agent agent = buildAgent();
        ExternalCheckInResponseDTO externalCheckIn = buildExternalCheckIn("seed_ci_004", "ext-event-checkin-002");
        stubSyncExecution();
        when(mediaApiClient.triggerCheckInsSync(null)).thenReturn(Mono.empty());
        when(mediaApiClient.findCheckIns(null, null))
                .thenReturn(Mono.just(new ExternalCheckInsResponseDTO(List.of(externalCheckIn))));
        when(checkInRepository.findByExternalCheckInId(externalCheckIn.id())).thenReturn(Optional.empty());
        when(checkInRepository.findByExternalEventId(externalCheckIn.externalEventId())).thenReturn(Optional.empty());
        when(agentRepository.findById(externalCheckIn.agentId())).thenReturn(Optional.of(agent));

        checkInSyncService.syncCheckIns();

        ArgumentCaptor<CheckIn> checkInCaptor = ArgumentCaptor.forClass(CheckIn.class);
        verify(checkInRepository).save(checkInCaptor.capture());
        CheckIn savedCheckIn = checkInCaptor.getValue();
        assertThat(savedCheckIn.getExternalCheckInId()).isEqualTo(externalCheckIn.id());
        assertThat(savedCheckIn.getExternalEventId()).isEqualTo(externalCheckIn.externalEventId());
        assertThat(savedCheckIn.getOrigin()).isEqualTo(CheckInOrigin.EXTERNAL_API);
    }

    @Test
    void syncCheckInsShouldUpdateExistingExternalCheckIn() {
        Agent agent = buildAgent();
        ExternalCheckInResponseDTO externalCheckIn = buildExternalCheckIn("seed_ci_004", "ext-event-checkin-002");
        CheckIn existingCheckIn = CheckIn.builder()
                .id(UUID.randomUUID())
                .agent(agent)
                .externalCheckInId(externalCheckIn.id())
                .externalEventId("old-event")
                .type(CheckInType.CHECKOUT)
                .origin(CheckInOrigin.EXTERNAL_API)
                .source("SYSTEM")
                .latitude(-23.0)
                .longitude(-46.0)
                .occurredAt(Instant.parse("2026-05-22T03:00:00Z"))
                .build();
        stubSyncExecution();
        when(mediaApiClient.triggerCheckInsSync(null)).thenReturn(Mono.empty());
        when(mediaApiClient.findCheckIns(null, null))
                .thenReturn(Mono.just(new ExternalCheckInsResponseDTO(List.of(externalCheckIn))));
        when(checkInRepository.findByExternalCheckInId(externalCheckIn.id())).thenReturn(Optional.of(existingCheckIn));
        when(checkInRepository.findByExternalEventId(externalCheckIn.externalEventId())).thenReturn(Optional.empty());

        checkInSyncService.syncCheckIns();

        assertThat(existingCheckIn.getExternalEventId()).isEqualTo(externalCheckIn.externalEventId());
        assertThat(existingCheckIn.getType()).isEqualTo(CheckInType.CHECKIN);
        assertThat(existingCheckIn.getSource()).isEqualTo("MANUAL");
        verify(checkInRepository).save(existingCheckIn);
    }

    @Test
    void syncCheckInsShouldThrowWhenExternalEventIdConflicts() {
        ExternalCheckInResponseDTO externalCheckIn = buildExternalCheckIn("seed_ci_004", "ext-event-checkin-002");
        CheckIn conflictingCheckIn = CheckIn.builder()
                .id(UUID.randomUUID())
                .externalEventId(externalCheckIn.externalEventId())
                .build();
        stubSyncExecution();
        when(mediaApiClient.triggerCheckInsSync(null)).thenReturn(Mono.empty());
        when(mediaApiClient.findCheckIns(null, null))
                .thenReturn(Mono.just(new ExternalCheckInsResponseDTO(List.of(externalCheckIn))));
        when(checkInRepository.findByExternalCheckInId(externalCheckIn.id())).thenReturn(Optional.empty());
        when(checkInRepository.findByExternalEventId(externalCheckIn.externalEventId()))
                .thenReturn(Optional.of(conflictingCheckIn));

        assertThatThrownBy(() -> checkInSyncService.syncCheckIns())
                .isInstanceOf(BusinessException.class)
                .hasMessage("External check-in conflict detected. externalEventId already exists: "
                        + externalCheckIn.externalEventId());
    }

    private void stubSyncExecution() {
        SyncExecution execution = SyncExecution.builder()
                .id(UUID.randomUUID())
                .syncType(SyncType.CHECK_INS)
                .build();

        when(syncExecutionService.start(SyncType.CHECK_INS)).thenReturn(execution);
        when(syncExecutionService.getLastSuccessfulSyncToken(SyncType.CHECK_INS)).thenReturn(null);
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

    private ExternalCheckInResponseDTO buildExternalCheckIn(String id, String externalEventId) {
        return new ExternalCheckInResponseDTO(
                id,
                "seed_agent_002",
                CheckInType.CHECKIN,
                "MANUAL",
                -23.5629,
                -46.6544,
                "Rua da Consolacao, 500 - Sao Paulo, SP",
                12.0,
                0.0,
                "Inicio do turno",
                null,
                externalEventId,
                Instant.parse("2026-05-22T04:30:00Z"),
                Instant.parse("2026-05-23T02:35:36.331Z")
        );
    }
}
