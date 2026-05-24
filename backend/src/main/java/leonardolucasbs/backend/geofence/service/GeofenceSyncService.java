package leonardolucasbs.backend.geofence.service;

import leonardolucasbs.backend.external.MediaApiClient;
import leonardolucasbs.backend.geofence.dto.ExternalGeofenceResponseDTO;
import leonardolucasbs.backend.geofence.dto.ExternalGeofencesResponseDTO;
import leonardolucasbs.backend.geofence.entity.Geofence;
import leonardolucasbs.backend.geofence.mapper.GeofenceMapper;
import leonardolucasbs.backend.geofence.repository.GeofenceRepository;
import leonardolucasbs.backend.sync.entity.SyncExecution;
import leonardolucasbs.backend.sync.enums.SyncType;
import leonardolucasbs.backend.sync.service.SyncExecutionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeofenceSyncService {

    private final MediaApiClient mediaApiClient;
    private final GeofenceRepository geofenceRepository;
    private final GeofenceMapper geofenceMapper;
    private final SyncExecutionService syncExecutionService;

    @Transactional
    public void syncGeofences() {
        SyncExecution execution = syncExecutionService.start(SyncType.GEOFENCES);
        int itemsProcessed = 0;

        try {
            mediaApiClient.triggerGeofencesSync().block();
            ExternalGeofencesResponseDTO response = mediaApiClient.findGeofences().block();

            if (response == null || response.data() == null || response.data().isEmpty()) {
                syncExecutionService.markSuccess(execution.getId(), itemsProcessed, null);
                log.info("No external geofences found to synchronize.");
                return;
            }

            for (ExternalGeofenceResponseDTO externalGeofence : response.data()) {
                if (saveOrUpdateGeofence(externalGeofence)) {
                    itemsProcessed++;
                }
            }

            syncExecutionService.markSuccess(execution.getId(), itemsProcessed, null);
            log.info("Geofence synchronization completed successfully.");
        } catch (Exception exception) {
            syncExecutionService.markFailure(execution.getId(), exception.getMessage());
            log.error("Failed to synchronize geofences: {}", exception.getMessage(), exception);

            if (exception instanceof RuntimeException runtimeException) {
                throw runtimeException;
            }

            throw new IllegalStateException("Failed to synchronize geofences", exception);
        }
    }

    private boolean saveOrUpdateGeofence(ExternalGeofenceResponseDTO dto) {
        if (dto.externalId() == null || dto.externalId().isBlank()) {
            log.warn("Ignoring external geofence without externalId.");
            return false;
        }

        return geofenceRepository.findByExternalId(dto.externalId())
                .map(existingGeofence -> updateExistingGeofence(existingGeofence, dto))
                .orElseGet(() -> createGeofence(dto));
    }

    private boolean updateExistingGeofence(Geofence geofence, ExternalGeofenceResponseDTO dto) {
        geofenceMapper.updateFromExternalResponse(geofence, dto);
        geofenceRepository.save(geofence);

        return true;
    }

    private boolean createGeofence(ExternalGeofenceResponseDTO dto) {
        Geofence geofence = geofenceMapper.fromExternalResponse(dto);
        geofenceRepository.save(geofence);

        return true;
    }
}
