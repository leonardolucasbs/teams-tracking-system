package leonardolucasbs.backend.external.dto;

import java.util.List;

public record ExternalAgentsResponseDTO(
        List<ExternalAgentResponseDTO> data
) {
}
