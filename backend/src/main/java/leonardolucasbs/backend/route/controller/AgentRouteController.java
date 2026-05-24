package leonardolucasbs.backend.route.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import leonardolucasbs.backend.route.dto.AgentRouteSummaryDTO;
import leonardolucasbs.backend.route.service.AgentRouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
@Tag(name = "Rotas", description = "Resumo de rotas diarias e distancia percorrida pelos agentes")
public class AgentRouteController {

    private final AgentRouteService agentRouteService;

    @GetMapping("/agents/{agentId}/today")
    @Operation(
            summary = "Buscar rota do dia do agente",
            description = "Retorna o resumo da rota do dia com base nas localizacoes persistidas localmente."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Resumo da rota retornado com sucesso",
                    content = @Content(schema = @Schema(implementation = AgentRouteSummaryDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Agente nao encontrado", content = @Content)
    })
    public ResponseEntity<AgentRouteSummaryDTO> findTodayRouteByAgent(
            @Parameter(description = "Id do agente", example = "seed_agent_002", required = true)
            @PathVariable String agentId
    ) {
        AgentRouteSummaryDTO routeSummary = agentRouteService.findTodayRouteByAgent(agentId);

        return ResponseEntity.ok(routeSummary);
    }
}
