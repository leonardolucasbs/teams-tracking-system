package leonardolucasbs.backend.external.dto;

public record ExternalCheckInSyncResponseDTO(
        Integer synced,
        String syncToken
) {
}
