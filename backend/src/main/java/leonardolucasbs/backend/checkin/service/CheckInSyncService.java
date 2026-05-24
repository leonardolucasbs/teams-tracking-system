package leonardolucasbs.backend.checkin.service;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.checkin.dto.ExternalCheckInResponseDTO;
import leonardolucasbs.backend.checkin.dto.ExternalCheckInsResponseDTO;
import leonardolucasbs.backend.checkin.entity.CheckIn;
import leonardolucasbs.backend.checkin.mapper.CheckInMapper;
import leonardolucasbs.backend.checkin.repository.CheckInRepository;
import leonardolucasbs.backend.common.exception.BusinessException;
import leonardolucasbs.backend.external.MediaApiClient;
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

    @Transactional
    public void syncCheckIns() {
        ExternalCheckInsResponseDTO response = mediaApiClient.findCheckIns(null, null).block();

        if (response == null || response.data() == null || response.data().isEmpty()) {
            log.info("No external check-ins found to synchronize.");
            return;
        }

        for (ExternalCheckInResponseDTO externalCheckIn : response.data()) {
            saveOrUpdateExternalCheckIn(externalCheckIn);
        }

        log.info("Check-in synchronization completed successfully.");
    }

    private void saveOrUpdateExternalCheckIn(ExternalCheckInResponseDTO dto) {
        if (dto.id() == null || dto.id().isBlank()) {
            log.warn("Ignoring external check-in without id.");
            return;
        }

        checkInRepository.findByExternalCheckInId(dto.id())
                .ifPresentOrElse(
                        existingCheckIn -> updateExistingExternalCheckIn(existingCheckIn, dto),
                        () -> createExternalCheckInOrDetectConflict(dto)
                );
    }

    private void updateExistingExternalCheckIn(CheckIn checkIn, ExternalCheckInResponseDTO dto) {
        ensureExternalEventIdDoesNotBelongToAnotherCheckIn(checkIn, dto);
        checkInMapper.updateFromExternalResponse(checkIn, dto);
        checkInRepository.save(checkIn);
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

    private void createExternalCheckInOrDetectConflict(ExternalCheckInResponseDTO dto) {
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
            return;
        }

        CheckIn checkIn = checkInMapper.fromExternalResponse(dto, agent);
        checkInRepository.save(checkIn);
    }
}
