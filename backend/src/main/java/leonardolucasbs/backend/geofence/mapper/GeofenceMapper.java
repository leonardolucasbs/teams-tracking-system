package leonardolucasbs.backend.geofence.mapper;

import leonardolucasbs.backend.geofence.dto.ExternalGeofenceResponseDTO;
import leonardolucasbs.backend.geofence.dto.GeofenceResponseDTO;
import leonardolucasbs.backend.geofence.entity.Geofence;
import org.springframework.stereotype.Component;

@Component
public class GeofenceMapper {

    public Geofence fromExternalResponse(ExternalGeofenceResponseDTO dto) {
        return Geofence.builder()
                .id(dto.id())
                .externalId(dto.externalId())
                .name(dto.name())
                .type(dto.type())
                .coordinatesJson(dto.coordinatesJson())
                .alertOnEnter(dto.alertOnEnter())
                .alertOnExit(dto.alertOnExit())
                .assignedTeams(dto.assignedTeams())
                .syncedAt(dto.syncedAt())
                .build();
    }

    public void updateFromExternalResponse(Geofence geofence, ExternalGeofenceResponseDTO dto) {
        geofence.setName(dto.name());
        geofence.setType(dto.type());
        geofence.setCoordinatesJson(dto.coordinatesJson());
        geofence.setAlertOnEnter(dto.alertOnEnter());
        geofence.setAlertOnExit(dto.alertOnExit());
        geofence.setAssignedTeams(dto.assignedTeams());
        geofence.setSyncedAt(dto.syncedAt());
    }

    public GeofenceResponseDTO toResponse(Geofence geofence) {
        return new GeofenceResponseDTO(
                geofence.getId(),
                geofence.getExternalId(),
                geofence.getName(),
                geofence.getType(),
                geofence.getCoordinatesJson(),
                geofence.getAlertOnEnter(),
                geofence.getAlertOnExit(),
                geofence.getAssignedTeams(),
                geofence.getSyncedAt(),
                geofence.getCreatedAt(),
                geofence.getUpdatedAt()
        );
    }
}
