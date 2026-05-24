package leonardolucasbs.backend.sync.dto;

import leonardolucasbs.backend.sync.enums.SyncStatus;
import leonardolucasbs.backend.sync.enums.SyncType;

import java.time.Instant;

public record SyncTypeSummaryResponseDTO(
        SyncType syncType,
        SyncStatus lastStatus,
        Instant lastStartedAt,
        Instant lastFinishedAt,
        Integer lastItemsProcessed,
        String lastErrorMessage,
        String lastSyncToken
) {
}
