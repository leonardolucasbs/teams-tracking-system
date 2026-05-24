package leonardolucasbs.backend.sync.service;

import leonardolucasbs.backend.common.exception.ResourceNotFoundException;
import leonardolucasbs.backend.sync.dto.SyncExecutionResponseDTO;
import leonardolucasbs.backend.sync.dto.SyncSummaryResponseDTO;
import leonardolucasbs.backend.sync.dto.SyncTypeSummaryResponseDTO;
import leonardolucasbs.backend.sync.entity.SyncExecution;
import leonardolucasbs.backend.sync.enums.SyncStatus;
import leonardolucasbs.backend.sync.enums.SyncType;
import leonardolucasbs.backend.sync.mapper.SyncExecutionMapper;
import leonardolucasbs.backend.sync.repository.SyncExecutionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SyncExecutionService {

    private final SyncExecutionRepository syncExecutionRepository;
    private final SyncExecutionMapper syncExecutionMapper;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public SyncExecution start(SyncType syncType) {
        SyncExecution execution = SyncExecution.builder()
                .syncType(syncType)
                .status(SyncStatus.RUNNING)
                .startedAt(Instant.now())
                .itemsProcessed(0)
                .build();

        return syncExecutionRepository.save(execution);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public SyncExecution markSuccess(UUID executionId, Integer itemsProcessed, String syncToken) {
        SyncExecution execution = findEntityOrThrow(executionId);
        finishExecution(execution, SyncStatus.SUCCESS, itemsProcessed, null, syncToken);

        return syncExecutionRepository.save(execution);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public SyncExecution markFailure(UUID executionId, String errorMessage) {
        SyncExecution execution = findEntityOrThrow(executionId);
        finishExecution(execution, SyncStatus.FAILED, execution.getItemsProcessed(), errorMessage, execution.getSyncToken());

        return syncExecutionRepository.save(execution);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public SyncExecution markPartial(UUID executionId, Integer itemsProcessed, String errorMessage, String syncToken) {
        SyncExecution execution = findEntityOrThrow(executionId);
        finishExecution(execution, SyncStatus.PARTIAL, itemsProcessed, errorMessage, syncToken);

        return syncExecutionRepository.save(execution);
    }

    @Transactional(readOnly = true)
    public List<SyncExecutionResponseDTO> findAll() {
        return syncExecutionRepository.findAllByOrderByStartedAtDesc()
                .stream()
                .map(syncExecutionMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SyncExecutionResponseDTO> findByType(SyncType syncType) {
        return syncExecutionRepository.findBySyncTypeOrderByStartedAtDesc(syncType)
                .stream()
                .map(syncExecutionMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SyncExecutionResponseDTO findLatestByType(SyncType syncType) {
        SyncExecution execution = syncExecutionRepository.findFirstBySyncTypeOrderByStartedAtDesc(syncType)
                .orElseThrow(() -> new ResourceNotFoundException("No sync execution found for type: " + syncType));

        return syncExecutionMapper.toResponse(execution);
    }

    @Transactional(readOnly = true)
    public String getLastSuccessfulSyncToken(SyncType syncType) {
        return syncExecutionRepository
                .findFirstBySyncTypeAndStatusAndSyncTokenIsNotNullOrderByFinishedAtDesc(syncType, SyncStatus.SUCCESS)
                .map(SyncExecution::getSyncToken)
                .orElse(null);
    }

    @Transactional(readOnly = true)
    public SyncSummaryResponseDTO getSummary() {
        List<SyncTypeSummaryResponseDTO> items = Arrays.stream(SyncType.values())
                .map(syncExecutionRepository::findFirstBySyncTypeOrderByStartedAtDesc)
                .flatMap(Optional::stream)
                .map(syncExecutionMapper::toTypeSummary)
                .toList();

        return new SyncSummaryResponseDTO(items);
    }

    private void finishExecution(
            SyncExecution execution,
            SyncStatus status,
            Integer itemsProcessed,
            String errorMessage,
            String syncToken
    ) {
        Instant finishedAt = Instant.now();

        execution.setStatus(status);
        execution.setFinishedAt(finishedAt);
        execution.setDurationMs(Duration.between(execution.getStartedAt(), finishedAt).toMillis());
        execution.setItemsProcessed(itemsProcessed != null ? itemsProcessed : 0);
        execution.setErrorMessage(errorMessage);

        if (syncToken != null && !syncToken.isBlank()) {
            execution.setSyncToken(syncToken);
        }
    }

    private SyncExecution findEntityOrThrow(UUID executionId) {
        return syncExecutionRepository.findById(executionId)
                .orElseThrow(() -> new ResourceNotFoundException("Sync execution not found with id: " + executionId));
    }
}
