package leonardolucasbs.backend.geofence.repository;

import leonardolucasbs.backend.geofence.entity.Geofence;
import leonardolucasbs.backend.geofence.enums.GeofenceType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface GeofenceRepository extends JpaRepository<Geofence, String> {

    Optional<Geofence> findByExternalId(String externalId);

    List<Geofence> findByType(GeofenceType type);
}
