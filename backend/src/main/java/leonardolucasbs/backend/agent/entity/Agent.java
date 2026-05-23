package leonardolucasbs.backend.agent.entity;

import jakarta.persistence.*;
import leonardolucasbs.backend.agent.enums.AgentRole;
import leonardolucasbs.backend.agent.enums.AgentSource;
import leonardolucasbs.backend.agent.enums.AgentStatus;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "agents")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Agent {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, unique = true, length = 100)
    private String externalId;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AgentRole role;

    @Column(nullable = false, length = 80)
    private String team;

    @Column(length = 30)
    private String phone;

    @Column(length = 120)
    private String email;

    @Column(nullable = false)
    private Boolean active;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AgentStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AgentSource source;

    @Column(nullable = false)
    private Integer battery;

    private Instant lastSeen;

    private Instant externalCreatedAt;

    private Instant externalUpdatedAt;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();

        if (createdAt == null) {
            createdAt = now;
        }

        if (updatedAt == null) {
            updatedAt = now;
        }

        if (active == null) {
            active = true;
        }

        if (status == null) {
            status = AgentStatus.OFFLINE;
        }

        if (battery == null) {
            battery = 0;
        }

        if (source == null) {
            source = AgentSource.LOCAL;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}
