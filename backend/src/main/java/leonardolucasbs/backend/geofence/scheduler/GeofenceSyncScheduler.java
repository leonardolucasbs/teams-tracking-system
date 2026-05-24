package leonardolucasbs.backend.geofence.scheduler;

import leonardolucasbs.backend.geofence.service.GeofenceSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class GeofenceSyncScheduler {

    private final GeofenceSyncService geofenceSyncService;

    @Scheduled(fixedDelayString = "${schedulers.geofences.fixed-delay}")
    public void syncGeofences() {
        try {
            geofenceSyncService.syncGeofences();
        } catch (Exception exception) {
            log.error("Failed to synchronize geofences: {}", exception.getMessage(), exception);
        }
    }
}
