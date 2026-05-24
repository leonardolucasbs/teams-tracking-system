package leonardolucasbs.backend.checkin.mapper;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.checkin.dto.CheckInCreateRequestDTO;
import leonardolucasbs.backend.checkin.dto.CheckInResponseDTO;
import leonardolucasbs.backend.checkin.dto.ExternalCheckInResponseDTO;
import leonardolucasbs.backend.checkin.entity.CheckIn;
import leonardolucasbs.backend.checkin.enums.CheckInOrigin;
import leonardolucasbs.backend.checkin.enums.ExternalCheckInSource;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class CheckInMapper {

    public CheckIn fromCreateRequest(CheckInCreateRequestDTO dto, Agent agent) {
        return CheckIn.builder()
                .agent(agent)
                .type(dto.type())
                .origin(CheckInOrigin.LOCAL)
                .source(ExternalCheckInSource.MANUAL.name())
                .latitude(dto.latitude())
                .longitude(dto.longitude())
                .address(dto.address())
                .accuracy(dto.accuracy())
                .speed(dto.speed())
                .notes(dto.notes())
                .occurredAt(dto.occurredAt() != null ? dto.occurredAt() : Instant.now())
                .build();
    }

    public CheckIn fromExternalResponse(ExternalCheckInResponseDTO dto, Agent agent) {
        return CheckIn.builder()
                .agent(agent)
                .externalCheckInId(dto.id())
                .externalEventId(dto.externalEventId())
                .type(dto.type())
                .origin(CheckInOrigin.EXTERNAL_API)
                .source(dto.source())
                .latitude(dto.latitude())
                .longitude(dto.longitude())
                .address(dto.address())
                .accuracy(dto.accuracy())
                .speed(dto.speed())
                .notes(dto.notes())
                .distanceFromPrevious(dto.distanceFromPrevious())
                .occurredAt(dto.occurredAt() != null ? dto.occurredAt() : Instant.now())
                .syncedAt(dto.syncedAt())
                .build();
    }

    public void updateFromExternalResponse(CheckIn checkIn, ExternalCheckInResponseDTO dto) {
        checkIn.setExternalEventId(dto.externalEventId());
        checkIn.setType(dto.type());
        checkIn.setOrigin(CheckInOrigin.EXTERNAL_API);
        checkIn.setSource(dto.source());
        checkIn.setLatitude(dto.latitude());
        checkIn.setLongitude(dto.longitude());
        checkIn.setAddress(dto.address());
        checkIn.setAccuracy(dto.accuracy());
        checkIn.setSpeed(dto.speed());
        checkIn.setNotes(dto.notes());
        checkIn.setDistanceFromPrevious(dto.distanceFromPrevious());
        checkIn.setOccurredAt(dto.occurredAt() != null ? dto.occurredAt() : checkIn.getOccurredAt());
        checkIn.setSyncedAt(dto.syncedAt());
    }

    public CheckInResponseDTO toResponse(CheckIn checkIn) {
        return new CheckInResponseDTO(
                checkIn.getId(),
                checkIn.getAgent().getId(),
                checkIn.getAgent().getName(),
                checkIn.getExternalCheckInId(),
                checkIn.getExternalEventId(),
                checkIn.getType(),
                checkIn.getOrigin(),
                checkIn.getSource(),
                checkIn.getLatitude(),
                checkIn.getLongitude(),
                checkIn.getAddress(),
                checkIn.getAccuracy(),
                checkIn.getSpeed(),
                checkIn.getNotes(),
                checkIn.getDistanceFromPrevious(),
                checkIn.getOccurredAt(),
                checkIn.getSyncedAt(),
                checkIn.getCreatedAt(),
                checkIn.getUpdatedAt()
        );
    }
}
