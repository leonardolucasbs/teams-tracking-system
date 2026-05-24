package leonardolucasbs.backend.geofence.entity;

import jakarta.persistence.*;
import leonardolucasbs.backend.geofence.enums.GeofenceType;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "geofences")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Geofence {

    @Id
    @Column(length = 100)
    private String id;

    @Column(nullable = false, unique = true, length = 100)
    private String externalId;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private GeofenceType type;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String coordinatesJson;

    @Column(nullable = false)
    private Boolean alertOnEnter;

    @Column(nullable = false)
    private Boolean alertOnExit;

    @Column(length = 255)
    private String assignedTeams;

    @Column(nullable = false)
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
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}
