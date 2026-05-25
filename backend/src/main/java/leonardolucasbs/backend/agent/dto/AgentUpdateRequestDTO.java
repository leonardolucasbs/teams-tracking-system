package leonardolucasbs.backend.agent.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import leonardolucasbs.backend.agent.enums.AgentRole;
import leonardolucasbs.backend.agent.enums.AgentStatus;

public record AgentUpdateRequestDTO(

        @NotBlank(message = "The name is required")
        String name,

        @NotNull(message = "The agent field is required")
        AgentRole role,

        @NotBlank(message = "The Team is required")
        String team,

        @NotBlank(message = "The phone is required")
        String phone,

        @Email(message = "Invalid email address")
        String email,

        @NotNull(message = "The Status is required")
        AgentStatus status,

        @NotNull(message = "The active is required")
        Boolean active
) {
}
