package leonardolucasbs.backend.geofence.controller;

import leonardolucasbs.backend.geofence.dto.GeofenceResponseDTO;
import leonardolucasbs.backend.geofence.enums.GeofenceType;
import leonardolucasbs.backend.geofence.service.GeofenceService;
import leonardolucasbs.backend.geofence.service.GeofenceSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/geofences")
@RequiredArgsConstructor
public class GeofenceController {

    private final GeofenceService geofenceService;
    private final GeofenceSyncService geofenceSyncService;

    @GetMapping
    public ResponseEntity<List<GeofenceResponseDTO>> findAll() {
        return ResponseEntity.ok(geofenceService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GeofenceResponseDTO> findById(@PathVariable String id) {
        return ResponseEntity.ok(geofenceService.findById(id));
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<GeofenceResponseDTO>> findByType(@PathVariable GeofenceType type) {
        return ResponseEntity.ok(geofenceService.findByType(type));
    }

    @PostMapping("/sync")
    public ResponseEntity<Void> syncGeofences() {
        geofenceSyncService.syncGeofences();

        return ResponseEntity.noContent().build();
    }
}
