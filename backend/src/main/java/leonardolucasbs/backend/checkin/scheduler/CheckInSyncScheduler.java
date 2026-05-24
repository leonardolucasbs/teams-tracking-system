package leonardolucasbs.backend.checkin.scheduler;

import leonardolucasbs.backend.checkin.service.CheckInSyncService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class CheckInSyncScheduler {

    private final CheckInSyncService checkInSyncService;

    @Scheduled(fixedDelayString = "${schedulers.check-ins.fixed-delay}")
    public void syncCheckIns() {
        try {
            checkInSyncService.syncCheckIns();
        } catch (Exception exception) {
            log.error("Failed to synchronize check-ins: {}", exception.getMessage(), exception);
        }
    }
}
