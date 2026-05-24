package leonardolucasbs.backend.location.scheduler;

import leonardolucasbs.backend.location.service.AgentLocationSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AgentLocationSyncScheduler {

    private final AgentLocationSyncService locationSyncService;

    @Scheduled(fixedDelayString = "${schedulers.locations.fixed-delay}")
    public void syncLocations() {
        locationSyncService.syncLocations();
    }
}