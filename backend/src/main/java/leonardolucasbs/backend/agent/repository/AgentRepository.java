package leonardolucasbs.backend.agent.repository;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.enums.AgentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AgentRepository extends JpaRepository<Agent, String> {

    Optional<Agent> findByExternalId(String externalId);

    boolean existsByExternalId(String externalId);

    List<Agent> findByStatus(AgentStatus status);

    List<Agent> findByTeamIgnoreCase(String team);

    List<Agent> findByActiveTrue();

    List<Agent> findByActiveFalse();

}
