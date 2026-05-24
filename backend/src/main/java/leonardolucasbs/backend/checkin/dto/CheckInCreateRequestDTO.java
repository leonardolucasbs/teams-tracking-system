package leonardolucasbs.backend.checkin.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import leonardolucasbs.backend.checkin.enums.CheckInType;

import java.time.Instant;

public record CheckInCreateRequestDTO(
        @NotBlank
        String agentId,

        @NotNull
        CheckInType type,

        @NotNull
        @DecimalMin("-90.0")
        @DecimalMax("90.0")
        Double latitude,

        @NotNull
        @DecimalMin("-180.0")
        @DecimalMax("180.0")
        Double longitude,

        String address,
        Double accuracy,
        Double speed,
        String notes,
        Instant occurredAt
) {
}
