package leonardolucasbs.backend.checkin.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import leonardolucasbs.backend.checkin.dto.CheckInCreateRequestDTO;
import leonardolucasbs.backend.checkin.dto.CheckInResponseDTO;
import leonardolucasbs.backend.checkin.enums.CheckInType;
import leonardolucasbs.backend.checkin.service.CheckInService;
import leonardolucasbs.backend.checkin.service.CheckInSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/check-ins")
@RequiredArgsConstructor
@Tag(name = "Check-ins", description = "Registro manual, consulta e sincronizacao de check-ins dos agentes")
public class CheckInController {

    private final CheckInService checkInService;
    private final CheckInSyncService checkInSyncService;

    @PostMapping
    @Operation(
            summary = "Criar check-in manual",
            description = "Registra manualmente um check-in ou evento operacional para um agente existente."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Check-in criado com sucesso",
                    content = @Content(schema = @Schema(implementation = CheckInResponseDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Corpo da requisicao invalido", content = @Content),
            @ApiResponse(responseCode = "404", description = "Agente nao encontrado", content = @Content)
    })
    public ResponseEntity<CheckInResponseDTO> create(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dados do check-in manual",
                    required = true,
                    content = @Content(schema = @Schema(implementation = CheckInCreateRequestDTO.class))
            )
            @RequestBody @Valid CheckInCreateRequestDTO dto
    ) {
        CheckInResponseDTO createdCheckIn = checkInService.create(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdCheckIn);
    }

    @GetMapping
    @Operation(
            summary = "Listar check-ins",
            description = "Retorna check-ins persistidos localmente, com filtros opcionais por agente e tipo."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Check-ins retornados com sucesso",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = CheckInResponseDTO.class)))
            )
    })
    public ResponseEntity<List<CheckInResponseDTO>> findAll(
            @Parameter(description = "Id do agente para filtrar os check-ins", example = "seed_agent_002")
            @RequestParam(required = false) String agentId,
            @Parameter(description = "Tipo do check-in", example = "CHECKIN")
            @RequestParam(required = false) CheckInType type
    ) {
        List<CheckInResponseDTO> checkIns = checkInService.findAll(agentId, type);

        return ResponseEntity.ok(checkIns);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Buscar check-in por id",
            description = "Retorna um check-in especifico pelo seu identificador interno UUID."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Check-in encontrado",
                    content = @Content(schema = @Schema(implementation = CheckInResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Check-in nao encontrado", content = @Content)
    })
    public ResponseEntity<CheckInResponseDTO> findById(
            @Parameter(description = "Id interno do check-in", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
            @PathVariable UUID id
    ) {
        CheckInResponseDTO checkIn = checkInService.findById(id);

        return ResponseEntity.ok(checkIn);
    }

    @GetMapping("/agents/{agentId}")
    @Operation(
            summary = "Listar check-ins por agente",
            description = "Retorna todos os check-ins de um agente ordenados pela data de ocorrencia."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Check-ins do agente retornados com sucesso",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = CheckInResponseDTO.class)))
            ),
            @ApiResponse(responseCode = "404", description = "Agente nao encontrado", content = @Content)
    })
    public ResponseEntity<List<CheckInResponseDTO>> findByAgent(
            @Parameter(description = "Id do agente", example = "seed_agent_002", required = true)
            @PathVariable String agentId
    ) {
        List<CheckInResponseDTO> checkIns = checkInService.findByAgent(agentId);

        return ResponseEntity.ok(checkIns);
    }

    @GetMapping("/agents/{agentId}/today")
    @Operation(
            summary = "Listar check-ins do dia por agente",
            description = "Retorna os check-ins do agente registrados no dia atual da aplicacao."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Check-ins do dia retornados com sucesso",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = CheckInResponseDTO.class)))
            ),
            @ApiResponse(responseCode = "404", description = "Agente nao encontrado", content = @Content)
    })
    public ResponseEntity<List<CheckInResponseDTO>> findTodayByAgent(
            @Parameter(description = "Id do agente", example = "seed_agent_002", required = true)
            @PathVariable String agentId
    ) {
        List<CheckInResponseDTO> checkIns = checkInService.findTodayByAgent(agentId);

        return ResponseEntity.ok(checkIns);
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Excluir check-in",
            description = "Remove um check-in persistido localmente pelo seu identificador interno."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Check-in excluido com sucesso", content = @Content),
            @ApiResponse(responseCode = "404", description = "Check-in nao encontrado", content = @Content)
    })
    public ResponseEntity<Void> delete(
            @Parameter(description = "Id interno do check-in", example = "550e8400-e29b-41d4-a716-446655440000", required = true)
            @PathVariable UUID id
    ) {
        checkInService.delete(id);

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sync")
    @Operation(
            summary = "Sincronizar check-ins",
            description = "Executa manualmente a sincronizacao de check-ins com a API externa para testes e operacao."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Sincronizacao executada com sucesso", content = @Content),
            @ApiResponse(responseCode = "409", description = "Conflito em dados externos sincronizados", content = @Content),
            @ApiResponse(responseCode = "502", description = "Erro ao consumir a API externa", content = @Content)
    })
    public ResponseEntity<Void> syncCheckIns() {
        checkInSyncService.syncCheckIns();

        return ResponseEntity.noContent().build();
    }
}
