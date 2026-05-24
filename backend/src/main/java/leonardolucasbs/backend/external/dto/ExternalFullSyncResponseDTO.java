package leonardolucasbs.backend.external.dto;

public record ExternalFullSyncResponseDTO(
        Integer agents,
        Integer locations,
        Integer checkIns,
        Integer geofences
) {
}
