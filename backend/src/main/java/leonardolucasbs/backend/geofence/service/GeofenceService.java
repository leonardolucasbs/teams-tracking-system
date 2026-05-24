package leonardolucasbs.backend.geofence.service;

import leonardolucasbs.backend.common.exception.ResourceNotFoundException;
import leonardolucasbs.backend.geofence.dto.GeofenceResponseDTO;
import leonardolucasbs.backend.geofence.entity.Geofence;
import leonardolucasbs.backend.geofence.enums.GeofenceType;
import leonardolucasbs.backend.geofence.mapper.GeofenceMapper;
import leonardolucasbs.backend.geofence.repository.GeofenceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GeofenceService {

    private final GeofenceRepository geofenceRepository;
    private final GeofenceMapper geofenceMapper;

    public List<GeofenceResponseDTO> findAll() {
        return geofenceRepository.findAll()
                .stream()
                .map(geofenceMapper::toResponse)
                .toList();
    }

    public GeofenceResponseDTO findById(String id) {
        Geofence geofence = geofenceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Geofence not found with id: " + id));

        return geofenceMapper.toResponse(geofence);
    }

    public List<GeofenceResponseDTO> findByType(GeofenceType type) {
        return geofenceRepository.findByType(type)
                .stream()
                .map(geofenceMapper::toResponse)
                .toList();
    }
}
