package leonardolucasbs.backend.sync.entity;

import jakarta.persistence.*;
import leonardolucasbs.backend.sync.enums.SyncStatus;
import leonardolucasbs.backend.sync.enums.SyncType;
import lombok.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "sync_executions")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SyncExecution {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SyncType syncType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private SyncStatus status;

    @Column(nullable = false)
    private Instant startedAt;

    private Instant finishedAt;

    private Long durationMs;

    @Column(nullable = false)
    private Integer itemsProcessed;

    @Column(length = 255)
    private String syncToken;

    @Column(length = 1000)
    private String errorMessage;

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

        if (itemsProcessed == null) {
            itemsProcessed = 0;
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}
