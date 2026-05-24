package leonardolucasbs.backend.sync.repository;

import leonardolucasbs.backend.sync.entity.SyncExecution;
import leonardolucasbs.backend.sync.enums.SyncStatus;
import leonardolucasbs.backend.sync.enums.SyncType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SyncExecutionRepository extends JpaRepository<SyncExecution, UUID> {

    List<SyncExecution> findAllByOrderByStartedAtDesc();

    List<SyncExecution> findBySyncTypeOrderByStartedAtDesc(SyncType syncType);

    Optional<SyncExecution> findFirstBySyncTypeOrderByStartedAtDesc(SyncType syncType);

    Optional<SyncExecution> findFirstBySyncTypeAndStatusAndSyncTokenIsNotNullOrderByFinishedAtDesc(
            SyncType syncType,
            SyncStatus status
    );
}
