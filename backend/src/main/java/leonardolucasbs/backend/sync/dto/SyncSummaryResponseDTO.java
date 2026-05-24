package leonardolucasbs.backend.sync.dto;

import java.util.List;

public record SyncSummaryResponseDTO(
        List<SyncTypeSummaryResponseDTO> items
) {
}
