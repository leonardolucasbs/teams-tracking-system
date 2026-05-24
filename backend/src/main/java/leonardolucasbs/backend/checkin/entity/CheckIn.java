package leonardolucasbs.backend.checkin.entity;

import jakarta.persistence.*;
import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.checkin.enums.CheckInOrigin;
import leonardolucasbs.backend.checkin.enums.CheckInType;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "check_ins")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckIn {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id", nullable = false)
    private Agent agent;

    @Column(name = "external_check_in_id", unique = true, length = 100)
    private String externalCheckInId;

    @Column(name = "external_event_id", unique = true, length = 120)
    private String externalEventId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CheckInType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CheckInOrigin origin;

    @Column(length = 40)
    private String source;

    private Double latitude;

    private Double longitude;

    @Column(length = 255)
    private String address;

    private Double accuracy;

    private Double speed;

    @Column(length = 500)
    private String notes;

    private Double distanceFromPrevious;

    @Column(nullable = false)
    private Instant occurredAt;

    private Instant syncedAt;

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

        if (occurredAt == null) {
            occurredAt = now;
        }

        if (origin == null) {
            origin = CheckInOrigin.LOCAL;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}
