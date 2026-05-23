package leonardolucasbs.backend.agent.dto;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import leonardolucasbs.backend.agent.enums.AgentRole;
import leonardolucasbs.backend.agent.enums.AgentStatus;

public record AgentCreateRequestDTO(

        @NotBlank(message = "The name is required")
        String name,

        @NotNull(message = "The agent field is required")
        AgentRole role,

        @NotBlank(message = "The team is required")
        String team,

        @NotBlank(message = "The phone is required")
        String phone,

        @Email(message = "Invalid email address")
        String email,

        @NotNull(message = "Status is required")
        AgentStatus status,

        @Min(value = 0, message = "The battery level cannot be less than 0")
        @Max(value = 100, message = "The battery capacity cannot exceed 100")
        Integer battery,

        @NotBlank(message = "The active is required")
        Boolean active
) {
}