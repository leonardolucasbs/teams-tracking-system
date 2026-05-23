package leonardolucasbs.backend.agent.scheduler;

import leonardolucasbs.backend.agent.service.AgentSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AgentSyncScheduler {

    private final AgentSyncService agentSyncService;

    @Scheduled(fixedDelayString = "${schedulers.agents.fixed-delay}")
    public void syncAgents() {
        agentSyncService.syncAgents();
    }
}