package leonardolucasbs.backend.checkin.service;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.checkin.dto.ExternalCheckInResponseDTO;
import leonardolucasbs.backend.checkin.dto.ExternalCheckInsResponseDTO;
import leonardolucasbs.backend.checkin.entity.CheckIn;
import leonardolucasbs.backend.checkin.enums.CheckInOrigin;
import leonardolucasbs.backend.checkin.enums.ExternalCheckInSource;
import leonardolucasbs.backend.checkin.mapper.CheckInMapper;
import leonardolucasbs.backend.checkin.repository.CheckInRepository;
import leonardolucasbs.backend.common.exception.BusinessException;
import leonardolucasbs.backend.external.MediaApiClient;
import leonardolucasbs.backend.external.dto.ExternalCheckInSyncResponseDTO;
import leonardolucasbs.backend.sync.entity.SyncExecution;
import leonardolucasbs.backend.sync.enums.SyncType;
import leonardolucasbs.backend.sync.service.SyncExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class CheckInSyncService {

    private final MediaApiClient mediaApiClient;
    private final AgentRepository agentRepository;
    private final CheckInRepository checkInRepository;
    private final CheckInMapper checkInMapper;
    private final SyncExecutionService syncExecutionService;

    @Transactional
    public void syncCheckIns() {
        SyncExecution execution = syncExecutionService.start(SyncType.CHECK_INS);
        int itemsProcessed = 0;
        String syncToken = syncExecutionService.getLastSuccessfulSyncToken(SyncType.CHECK_INS);
        String partialErrorMessage = null;

        try {
            try {
                ExternalCheckInSyncResponseDTO syncResponse = mediaApiClient.triggerCheckInsSync(syncToken).block();

                if (syncResponse != null && syncResponse.syncToken() != null && !syncResponse.syncToken().isBlank()) {
                    syncToken = syncResponse.syncToken();
                }
            } catch (Exception exception) {
                partialErrorMessage = "External check-in trigger failed, fallback GET was used: " + exception.getMessage();
                log.warn(partialErrorMessage);
            }

            ExternalCheckInsResponseDTO response = mediaApiClient.findCheckIns(null, null).block();

            if (response == null || response.data() == null || response.data().isEmpty()) {
                if (partialErrorMessage == null) {
                    syncExecutionService.markSuccess(execution.getId(), itemsProcessed, syncToken);
                } else {
                    syncExecutionService.markPartial(execution.getId(), itemsProcessed, partialErrorMessage, syncToken);
                }

                log.info("No external check-ins found to synchronize.");
                return;
            }

            for (ExternalCheckInResponseDTO externalCheckIn : response.data()) {
                if (saveOrUpdateExternalCheckIn(externalCheckIn)) {
                    itemsProcessed++;
                }
            }

            if (partialErrorMessage == null) {
                syncExecutionService.markSuccess(execution.getId(), itemsProcessed, syncToken);
            } else {
                syncExecutionService.markPartial(execution.getId(), itemsProcessed, partialErrorMessage, syncToken);
            }

            log.info("Check-in synchronization completed successfully.");
        } catch (Exception exception) {
            syncExecutionService.markFailure(execution.getId(), exception.getMessage());
            log.error("Failed to synchronize check-ins: {}", exception.getMessage(), exception);
            if (exception instanceof RuntimeException runtimeException) {
                throw runtimeException;
            }

            throw new IllegalStateException("Failed to synchronize check-ins", exception);
        }
    }

    private boolean saveOrUpdateExternalCheckIn(ExternalCheckInResponseDTO dto) {
        if (dto.id() == null || dto.id().isBlank()) {
            log.warn("Ignoring external check-in without id.");
            return false;
        }

        return checkInRepository.findByExternalCheckInId(dto.id())
                .map(existingCheckIn -> updateExistingExternalCheckIn(existingCheckIn, dto))
                .orElseGet(() -> createExternalCheckInOrDetectConflict(dto));
    }

    private boolean updateExistingExternalCheckIn(CheckIn checkIn, ExternalCheckInResponseDTO dto) {
        if (isManualLocalCheckIn(checkIn)) {
            log.warn(
                    "Ignoring external check-in update because local manual data has priority. checkInId={}",
                    checkIn.getId()
            );
            return false;
        }

        ensureExternalEventIdDoesNotBelongToAnotherCheckIn(checkIn, dto);
        checkInMapper.updateFromExternalResponse(checkIn, dto);
        checkInRepository.save(checkIn);

        return true;
    }

    private boolean isManualLocalCheckIn(CheckIn checkIn) {
        return checkIn.getOrigin() == CheckInOrigin.LOCAL
                || ExternalCheckInSource.MANUAL.name().equals(checkIn.getSource());
    }

    private void ensureExternalEventIdDoesNotBelongToAnotherCheckIn(CheckIn checkIn, ExternalCheckInResponseDTO dto) {
        if (dto.externalEventId() == null || dto.externalEventId().isBlank()) {
            return;
        }

        checkInRepository.findByExternalEventId(dto.externalEventId())
                .filter(conflictingCheckIn -> !Objects.equals(conflictingCheckIn.getId(), checkIn.getId()))
                .ifPresent(conflictingCheckIn -> {
                    throw new BusinessException(
                            "External check-in conflict detected. externalEventId already exists: "
                                    + dto.externalEventId()
                    );
                });
    }

    private boolean createExternalCheckInOrDetectConflict(ExternalCheckInResponseDTO dto) {
        if (dto.externalEventId() != null && !dto.externalEventId().isBlank()) {
            checkInRepository.findByExternalEventId(dto.externalEventId())
                    .ifPresent(conflictingCheckIn -> {
                        throw new BusinessException(
                                "External check-in conflict detected. externalEventId already exists: "
                                        + dto.externalEventId()
                        );
                    });
        }

        Agent agent = agentRepository.findById(dto.agentId()).orElse(null);

        if (agent == null) {
            log.warn("Ignoring external check-in because agent was not found. agentId={}", dto.agentId());
            return false;
        }

        CheckIn checkIn = checkInMapper.fromExternalResponse(dto, agent);
        checkInRepository.save(checkIn);

        return true;
    }
}
