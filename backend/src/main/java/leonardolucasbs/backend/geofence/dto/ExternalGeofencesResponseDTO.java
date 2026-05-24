package leonardolucasbs.backend.geofence.dto;

import java.util.List;

public record ExternalGeofencesResponseDTO(
        List<ExternalGeofenceResponseDTO> data
) {
}
