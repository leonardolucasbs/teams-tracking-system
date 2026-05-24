package leonardolucasbs.backend.sync.mapper;

import leonardolucasbs.backend.sync.dto.SyncExecutionResponseDTO;
import leonardolucasbs.backend.sync.dto.SyncTypeSummaryResponseDTO;
import leonardolucasbs.backend.sync.entity.SyncExecution;
import org.springframework.stereotype.Component;

@Component
public class SyncExecutionMapper {

    public SyncExecutionResponseDTO toResponse(SyncExecution execution) {
        return new SyncExecutionResponseDTO(
                execution.getId(),
                execution.getSyncType(),
                execution.getStatus(),
                execution.getStartedAt(),
                execution.getFinishedAt(),
                execution.getDurationMs(),
                execution.getItemsProcessed(),
                execution.getSyncToken(),
                execution.getErrorMessage(),
                execution.getCreatedAt(),
                execution.getUpdatedAt()
        );
    }

    public SyncTypeSummaryResponseDTO toTypeSummary(SyncExecution execution) {
        return new SyncTypeSummaryResponseDTO(
                execution.getSyncType(),
                execution.getStatus(),
                execution.getStartedAt(),
                execution.getFinishedAt(),
                execution.getItemsProcessed(),
                execution.getErrorMessage(),
                execution.getSyncToken()
        );
    }
}
