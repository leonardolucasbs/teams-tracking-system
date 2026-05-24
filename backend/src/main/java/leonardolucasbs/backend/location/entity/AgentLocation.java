package leonardolucasbs.backend.location.entity;

import jakarta.persistence.*;
import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.enums.AgentStatus;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "agent_locations")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AgentLocation {

    @Id
    @Column(length = 180)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @Column(nullable = false, length = 100)
    private String externalId;

    @Column(nullable = false, length = 120)
    private String agentName;

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(length = 255)
    private String currentAddress;

    private Double accuracy;

    private Double speed;

    private Integer battery;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private AgentStatus status;

    @Column(nullable = false)
    private Instant lastSeen;

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
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}