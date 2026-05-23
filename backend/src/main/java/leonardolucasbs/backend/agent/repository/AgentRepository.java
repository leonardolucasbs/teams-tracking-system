package leonardolucasbs.backend.agent.repository;

import leonardolucasbs.backend.agent.entity.Agent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgentRepository extends JpaRepository<Agent, String> {

}
