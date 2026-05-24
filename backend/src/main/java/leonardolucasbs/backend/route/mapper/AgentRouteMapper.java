package leonardolucasbs.backend.route.mapper;

import leonardolucasbs.backend.location.entity.AgentLocation;
import leonardolucasbs.backend.route.dto.AgentRoutePointDTO;
import org.springframework.stereotype.Component;

@Component
public class AgentRouteMapper {

    public AgentRoutePointDTO toPoint(AgentLocation location) {
        return new AgentRoutePointDTO(
                location.getId(),
                location.getLatitude(),
                location.getLongitude(),
                location.getCurrentAddress(),
                location.getAccuracy(),
                location.getSpeed(),
                location.getBattery(),
                location.getStatus(),
                location.getLastSeen()
        );
    }
}
