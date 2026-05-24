package leonardolucasbs.backend.checkin.repository;

import leonardolucasbs.backend.checkin.entity.CheckIn;
import leonardolucasbs.backend.checkin.enums.CheckInType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CheckInRepository extends JpaRepository<CheckIn, UUID> {

    Optional<CheckIn> findByExternalCheckInId(String externalCheckInId);

    Optional<CheckIn> findByExternalEventId(String externalEventId);

    List<CheckIn> findAllByOrderByOccurredAtDesc();

    List<CheckIn> findByAgentIdOrderByOccurredAtDesc(String agentId);

    List<CheckIn> findByAgentIdAndTypeOrderByOccurredAtDesc(String agentId, CheckInType type);

    List<CheckIn> findByTypeOrderByOccurredAtDesc(CheckInType type);

    List<CheckIn> findByAgentIdAndOccurredAtBetweenOrderByOccurredAtAsc(
            String agentId,
            Instant start,
            Instant end
    );
}
