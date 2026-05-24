package leonardolucasbs.backend.external.dto;

import java.util.List;

public record ExternalAgentLocationsResponseDTO(
        List<ExternalAgentLocationResponseDTO> data
) {
}