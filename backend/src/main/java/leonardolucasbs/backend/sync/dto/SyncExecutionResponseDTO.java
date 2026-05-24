package leonardolucasbs.backend.sync.dto;

import leonardolucasbs.backend.sync.enums.SyncStatus;
import leonardolucasbs.backend.sync.enums.SyncType;

import java.time.Instant;
import java.util.UUID;

public record SyncExecutionResponseDTO(
        UUID id,
        SyncType syncType,
        SyncStatus status,
        Instant startedAt,
        Instant finishedAt,
        Long durationMs,
        Integer itemsProcessed,
        String syncToken,
        String errorMessage,
        Instant createdAt,
        Instant updatedAt
) {
}
