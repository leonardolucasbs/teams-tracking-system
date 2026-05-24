package leonardolucasbs.backend.location.repository;

import leonardolucasbs.backend.location.entity.AgentLocation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.List;

public interface AgentLocationRepository extends JpaRepository<AgentLocation, String> {

    List<AgentLocation> findByAgentIdOrderByLastSeenAsc(String agentId);

    List<AgentLocation> findByAgentIdAndLastSeenBetweenOrderByLastSeenAsc(
            String agentId,
            Instant start,
            Instant end
    );
}