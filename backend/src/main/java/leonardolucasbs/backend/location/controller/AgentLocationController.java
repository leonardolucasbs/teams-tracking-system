package leonardolucasbs.backend.location.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import leonardolucasbs.backend.location.dto.AgentLocationResponseDTO;
import leonardolucasbs.backend.location.service.AgentLocationService;
import leonardolucasbs.backend.location.service.AgentLocationSyncService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("api/location")
@Tag(name = "Localizacoes", description = "Consulta e sincronizacao de localizacoes dos agentes")
public class AgentLocationController {

    private final AgentLocationService locationService;
    private final AgentLocationSyncService locationSyncService;

    @PostMapping("/sync")
    @Operation(
            summary = "Sincronizar localizacoes",
            description = "Executa manualmente a sincronizacao de localizacoes dos agentes com a API externa."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Sincronizacao executada com sucesso", content = @Content),
            @ApiResponse(responseCode = "502", description = "Erro ao consumir a API externa", content = @Content)
    })
    public ResponseEntity<Void> syncLocations() {
        locationSyncService.syncLocations();

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Buscar localizacao por id",
            description = "Retorna uma localizacao especifica pelo seu identificador."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Localizacao encontrada",
                    content = @Content(schema = @Schema(implementation = AgentLocationResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Localizacao nao encontrada", content = @Content)
    })
    public AgentLocationResponseDTO findById(
            @Parameter(description = "Id da localizacao", example = "loc_123", required = true)
            @PathVariable String id
    ) {
        return locationService.findById(id);
    }

    @GetMapping("/agents/{agentId}")
    @Operation(
            summary = "Listar localizacoes por agente",
            description = "Retorna o historico de localizacoes de um agente ordenado pela data de captura."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Localizacoes encontradas",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AgentLocationResponseDTO.class)))
            ),
            @ApiResponse(responseCode = "404", description = "Nenhuma localizacao encontrada para o agente", content = @Content)
    })
    public List<AgentLocationResponseDTO> findByAgent(
            @Parameter(description = "Id do agente", example = "seed_agent_002", required = true)
            @PathVariable String agentId
    ) {
        return locationService.findByAgent(agentId);
    }

    @GetMapping("/agents/{agentId}/today-route")
    @Operation(
            summary = "Listar rota do dia por agente",
            description = "Retorna as localizacoes do agente registradas no dia atual, ordenadas pela data de captura."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Rota do dia encontrada",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AgentLocationResponseDTO.class)))
            ),
            @ApiResponse(responseCode = "404", description = "Nenhuma localizacao encontrada hoje para o agente", content = @Content)
    })
    public List<AgentLocationResponseDTO> findTodayRouteByAgent(
            @Parameter(description = "Id do agente", example = "seed_agent_002", required = true)
            @PathVariable String agentId
    ) {
        return locationService.findTodayRouteByAgent(agentId);
    }
}
