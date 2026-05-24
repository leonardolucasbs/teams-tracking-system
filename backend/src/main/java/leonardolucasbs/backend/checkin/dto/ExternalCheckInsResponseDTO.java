package leonardolucasbs.backend.checkin.dto;

import java.util.List;

public record ExternalCheckInsResponseDTO(
        List<ExternalCheckInResponseDTO> data
) {
}
