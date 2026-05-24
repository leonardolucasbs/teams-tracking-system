package leonardolucasbs.backend.checkin.service;

import leonardolucasbs.backend.agent.entity.Agent;
import leonardolucasbs.backend.agent.repository.AgentRepository;
import leonardolucasbs.backend.checkin.dto.CheckInCreateRequestDTO;
import leonardolucasbs.backend.checkin.dto.CheckInResponseDTO;
import leonardolucasbs.backend.checkin.entity.CheckIn;
import leonardolucasbs.backend.checkin.enums.CheckInType;
import leonardolucasbs.backend.checkin.mapper.CheckInMapper;
import leonardolucasbs.backend.checkin.repository.CheckInRepository;
import leonardolucasbs.backend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final AgentRepository agentRepository;
    private final CheckInMapper checkInMapper;

    public CheckInResponseDTO create(CheckInCreateRequestDTO dto) {
        Agent agent = findAgentOrThrow(dto.agentId());
        CheckIn checkIn = checkInMapper.fromCreateRequest(dto, agent);

        return checkInMapper.toResponse(checkInRepository.save(checkIn));
    }

    public List<CheckInResponseDTO> findAll(String agentId, CheckInType type) {
        List<CheckIn> checkIns;

        if (agentId != null && !agentId.isBlank() && type != null) {
            checkIns = checkInRepository.findByAgentIdAndTypeOrderByOccurredAtDesc(agentId, type);
        } else if (agentId != null && !agentId.isBlank()) {
            checkIns = checkInRepository.findByAgentIdOrderByOccurredAtDesc(agentId);
        } else if (type != null) {
            checkIns = checkInRepository.findByTypeOrderByOccurredAtDesc(type);
        } else {
            checkIns = checkInRepository.findAllByOrderByOccurredAtDesc();
        }

        return checkIns.stream()
                .map(checkInMapper::toResponse)
                .toList();
    }

    public CheckInResponseDTO findById(UUID id) {
        CheckIn checkIn = findCheckInOrThrow(id);

        return checkInMapper.toResponse(checkIn);
    }

    public List<CheckInResponseDTO> findByAgent(String agentId) {
        findAgentOrThrow(agentId);

        return checkInRepository.findByAgentIdOrderByOccurredAtDesc(agentId)
                .stream()
                .map(checkInMapper::toResponse)
                .toList();
    }

    public List<CheckInResponseDTO> findTodayByAgent(String agentId) {
        findAgentOrThrow(agentId);

        ZoneId zone = ZoneId.systemDefault();
        LocalDate today = LocalDate.now(zone);
        Instant start = today.atStartOfDay(zone).toInstant();
        Instant end = today.plusDays(1).atStartOfDay(zone).toInstant();

        return checkInRepository.findByAgentIdAndOccurredAtBetweenOrderByOccurredAtAsc(agentId, start, end)
                .stream()
                .map(checkInMapper::toResponse)
                .toList();
    }

    public void delete(UUID id) {
        CheckIn checkIn = findCheckInOrThrow(id);

        checkInRepository.delete(checkIn);
    }

    private Agent findAgentOrThrow(String agentId) {
        return agentRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found with id: " + agentId));
    }

    private CheckIn findCheckInOrThrow(UUID id) {
        return checkInRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Check-in not found with id: " + id));
    }
}
