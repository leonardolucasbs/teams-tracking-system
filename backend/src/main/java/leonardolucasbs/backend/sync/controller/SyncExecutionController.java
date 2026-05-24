package leonardolucasbs.backend.sync.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import leonardolucasbs.backend.sync.dto.SyncExecutionResponseDTO;
import leonardolucasbs.backend.sync.dto.SyncSummaryResponseDTO;
import leonardolucasbs.backend.sync.enums.SyncType;
import leonardolucasbs.backend.sync.service.SyncExecutionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sync")
@RequiredArgsConstructor
@Tag(name = "Sincronizacoes", description = "Historico e monitoramento das execucoes de sincronizacao")
public class SyncExecutionController {

    private final SyncExecutionService syncExecutionService;

    @GetMapping("/executions")
    @Operation(
            summary = "Listar execucoes de sincronizacao",
            description = "Retorna o historico completo das sincronizacoes registradas, ordenado da mais recente para a mais antiga."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Historico retornado com sucesso",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = SyncExecutionResponseDTO.class)))
            )
    })
    public ResponseEntity<List<SyncExecutionResponseDTO>> findAll() {
        return ResponseEntity.ok(syncExecutionService.findAll());
    }

    @GetMapping("/executions/type/{syncType}")
    @Operation(
            summary = "Listar execucoes por tipo",
            description = "Retorna o historico de sincronizacoes filtrado pelo tipo informado."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Historico do tipo informado retornado com sucesso",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = SyncExecutionResponseDTO.class)))
            )
    })
    public ResponseEntity<List<SyncExecutionResponseDTO>> findByType(
            @Parameter(description = "Tipo de sincronizacao", example = "CHECK_INS", required = true)
            @PathVariable SyncType syncType
    ) {
        return ResponseEntity.ok(syncExecutionService.findByType(syncType));
    }

    @GetMapping("/executions/latest/{syncType}")
    @Operation(
            summary = "Buscar ultima execucao por tipo",
            description = "Retorna a sincronizacao mais recente registrada para o tipo informado."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Ultima execucao encontrada",
                    content = @Content(schema = @Schema(implementation = SyncExecutionResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Nenhuma execucao encontrada para o tipo informado", content = @Content)
    })
    public ResponseEntity<SyncExecutionResponseDTO> findLatestByType(
            @Parameter(description = "Tipo de sincronizacao", example = "AGENTS", required = true)
            @PathVariable SyncType syncType
    ) {
        return ResponseEntity.ok(syncExecutionService.findLatestByType(syncType));
    }

    @GetMapping("/summary")
    @Operation(
            summary = "Resumo das sincronizacoes",
            description = "Retorna o ultimo status conhecido de cada tipo de sincronizacao para uso em painel de monitoramento."
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Resumo retornado com sucesso",
                    content = @Content(schema = @Schema(implementation = SyncSummaryResponseDTO.class))
            )
    })
    public ResponseEntity<SyncSummaryResponseDTO> getSummary() {
        return ResponseEntity.ok(syncExecutionService.getSummary());
    }
}
