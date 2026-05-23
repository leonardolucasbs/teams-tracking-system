package leonardolucasbs.backend.agent.controller;

import jakarta.validation.Valid;
import leonardolucasbs.backend.agent.dto.AgentCreateRequestDTO;
import leonardolucasbs.backend.agent.dto.AgentResponseDTO;
import leonardolucasbs.backend.agent.dto.AgentUpdateRequestDTO;
import leonardolucasbs.backend.agent.enums.AgentStatus;
import leonardolucasbs.backend.agent.service.AgentService;
import lombok.RequiredArgsConstructor;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agents")
@RequiredArgsConstructor
@Tag(name = "Agentes", description = "CRUD de agentes, gerenciamento de status e filtros operacionais")
public class AgentController {

    private final AgentService agentService;

    @PostMapping
    @Operation(
            summary = "Criar agente local",
            description = "Registra um novo agente de campo criado manualmente pelo usuario da aplicacao."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "201",
                    description = "Agente criado com sucesso",
                    content = @Content(schema = @Schema(implementation = AgentResponseDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Corpo da requisicao invalido", content = @Content),
            @ApiResponse(responseCode = "409", description = "Agente ja existe", content = @Content)
    })
    public ResponseEntity<AgentResponseDTO> registerAgent(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dados do agente a ser registrado",
                    required = true,
                    content = @Content(schema = @Schema(implementation = AgentCreateRequestDTO.class))
            )
            @RequestBody @Valid AgentCreateRequestDTO dto
    ) {
        AgentResponseDTO createdAgent = agentService.create(dto);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdAgent);
    }

    @GetMapping
    @Operation(
            summary = "Listar todos os agentes",
            description = "Retorna todos os agentes cadastrados localmente ou sincronizados pela API externa."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Agentes encontrados",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AgentResponseDTO.class)))
            ),
            @ApiResponse(responseCode = "404", description = "Nenhum agente encontrado", content = @Content)
    })
    public ResponseEntity<List<AgentResponseDTO>> findAll() {
        List<AgentResponseDTO> agents = agentService.findAll();

        return ResponseEntity.ok(agents);
    }

    @GetMapping("/status/{status}")
    @Operation(
            summary = "Buscar agentes por status",
            description = "Retorna agentes filtrados pelo status operacional."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Agentes encontrados para o status informado",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AgentResponseDTO.class)))
            ),
            @ApiResponse(responseCode = "404", description = "Nenhum agente encontrado para o status informado", content = @Content)
    })
    public ResponseEntity<List<AgentResponseDTO>> findByStatus(
            @Parameter(description = "Status do agente", example = "ONLINE", required = true)
            @PathVariable AgentStatus status
    ) {
        List<AgentResponseDTO> agents = agentService.findByStatus(status);

        return ResponseEntity.ok(agents);
    }

    @GetMapping("/team/{team}")
    @Operation(
            summary = "Buscar agentes por equipe",
            description = "Retorna agentes vinculados a equipe informada."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Agentes encontrados para a equipe informada",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AgentResponseDTO.class)))
            ),
            @ApiResponse(responseCode = "404", description = "Nenhum agente encontrado para a equipe informada", content = @Content)
    })
    public ResponseEntity<List<AgentResponseDTO>> findByTeam(
            @Parameter(description = "Nome da equipe", example = "Equipe Norte", required = true)
            @PathVariable String team
    ) {
        List<AgentResponseDTO> agents = agentService.findByTeam(team);

        return ResponseEntity.ok(agents);
    }

    @GetMapping("/active")
    @Operation(
            summary = "Listar agentes ativos",
            description = "Retorna apenas agentes marcados como ativos."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Agentes ativos encontrados",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AgentResponseDTO.class)))
            ),
            @ApiResponse(responseCode = "404", description = "Nenhum agente ativo encontrado", content = @Content)
    })
    public ResponseEntity<List<AgentResponseDTO>> findActiveAgents() {
        List<AgentResponseDTO> agents = agentService.findActiveAgents();

        return ResponseEntity.ok(agents);
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Buscar agente por id",
            description = "Retorna um unico agente pelo identificador textual local ou externo."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Agente encontrado",
                    content = @Content(schema = @Schema(implementation = AgentResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Agente nao encontrado", content = @Content)
    })
    public ResponseEntity<AgentResponseDTO> findById(
            @Parameter(description = "Id do agente", example = "seed_agent_002", required = true)
            @PathVariable String id
    ) {
        AgentResponseDTO agent = agentService.findById(id);

        return ResponseEntity.ok(agent);
    }

    @PutMapping("/{id}")
    @Operation(
            summary = "Atualizar agente",
            description = "Atualiza todos os dados editaveis de um agente existente."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Agente atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = AgentResponseDTO.class))
            ),
            @ApiResponse(responseCode = "400", description = "Corpo da requisicao invalido", content = @Content),
            @ApiResponse(responseCode = "404", description = "Agente nao encontrado", content = @Content)
    })
    public ResponseEntity<AgentResponseDTO> updateAgent(
            @Parameter(description = "Id do agente", example = "local_123", required = true)
            @PathVariable String id,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    description = "Dados atualizados do agente",
                    required = true,
                    content = @Content(schema = @Schema(implementation = AgentUpdateRequestDTO.class))
            )
            @RequestBody @Valid AgentUpdateRequestDTO dto
    ) {
        AgentResponseDTO updatedAgent = agentService.update(id, dto);

        return ResponseEntity.ok(updatedAgent);
    }

    @PatchMapping("/{id}/status")
    @Operation(
            summary = "Atualizar status do agente",
            description = "Atualiza apenas o status operacional de um agente existente."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Status do agente atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = AgentResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Agente nao encontrado", content = @Content),
            @ApiResponse(responseCode = "409", description = "Transicao de status invalida", content = @Content)
    })
    public ResponseEntity<AgentResponseDTO> updateStatus(
            @Parameter(description = "Id do agente", example = "local_123", required = true)
            @PathVariable String id,
            @Parameter(description = "Novo status", example = "ONLINE", required = true)
            @RequestParam AgentStatus status
    ) {
        AgentResponseDTO updatedAgent = agentService.updateStatus(id, status);

        return ResponseEntity.ok(updatedAgent);
    }

    @PatchMapping("/{id}/activate")
    @Operation(
            summary = "Ativar agente",
            description = "Marca um agente existente como ativo."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Agente ativado com sucesso",
                    content = @Content(schema = @Schema(implementation = AgentResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Agente nao encontrado", content = @Content),
            @ApiResponse(responseCode = "409", description = "Agente ja esta ativo", content = @Content)
    })
    public ResponseEntity<AgentResponseDTO> activateAgent(
            @Parameter(description = "Id do agente", example = "local_123", required = true)
            @PathVariable String id
    ) {
        AgentResponseDTO updatedAgent = agentService.activate(id);

        return ResponseEntity.ok(updatedAgent);
    }

    @PatchMapping("/{id}/deactivate")
    @Operation(
            summary = "Desativar agente",
            description = "Marca um agente existente como inativo e altera seu status para OFFLINE."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Agente desativado com sucesso",
                    content = @Content(schema = @Schema(implementation = AgentResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Agente nao encontrado", content = @Content),
            @ApiResponse(responseCode = "409", description = "Agente ja esta inativo", content = @Content)
    })
    public ResponseEntity<AgentResponseDTO> deactivateAgent(
            @Parameter(description = "Id do agente", example = "local_123", required = true)
            @PathVariable String id
    ) {
        AgentResponseDTO updatedAgent = agentService.deactivate(id);

        return ResponseEntity.ok(updatedAgent);
    }

    @DeleteMapping("/{id}")
    @Operation(
            summary = "Excluir agente",
            description = "Exclui um agente existente pelo id."
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Agente excluido com sucesso", content = @Content),
            @ApiResponse(responseCode = "404", description = "Agente nao encontrado", content = @Content)
    })
    public ResponseEntity<Void> deleteAgent(
            @Parameter(description = "Id do agente", example = "local_123", required = true)
            @PathVariable String id
    ) {
        agentService.delete(id);

        return ResponseEntity.noContent().build();
    }
}
