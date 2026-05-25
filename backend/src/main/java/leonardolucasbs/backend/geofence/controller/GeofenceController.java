package leonardolucasbs.backend.geofence.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import leonardolucasbs.backend.geofence.dto.GeofenceResponseDTO;
import leonardolucasbs.backend.geofence.enums.GeofenceType;
import leonardolucasbs.backend.geofence.service.GeofenceService;
import leonardolucasbs.backend.geofence.service.GeofenceSyncService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/geofences")
@RequiredArgsConstructor
@Tag(
        name = "Areas operacionais",
        description = "Endpoints internos para consultar areas operacionais sincronizadas, visualizar coordenadas e executar sincronizacao manual com a API externa."
)
public class GeofenceController {

    private final GeofenceService geofenceService;
    private final GeofenceSyncService geofenceSyncService;

    @GetMapping
    @Operation(
            summary = "Listar areas operacionais",
            description = """
                    Retorna todas as areas operacionais persistidas no banco local.
                    Cada item representa uma geofence sincronizada da API externa e contem identificadores, nome, tipo,
                    coordenadas em formato GeoJSON, configuracoes de alerta, equipes vinculadas e datas de sincronizacao.
                    Esse endpoint e usado pelo frontend para montar a listagem de areas operacionais sem consultar a API externa diretamente.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de areas operacionais retornada com sucesso. Pode retornar uma lista vazia quando ainda nao houver dados sincronizados.",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = GeofenceResponseDTO.class)))
            )
    })
    public ResponseEntity<List<GeofenceResponseDTO>> findAll() {
        return ResponseEntity.ok(geofenceService.findAll());
    }

    @GetMapping("/{id}")
    @Operation(
            summary = "Buscar area operacional por id",
            description = """
                    Retorna os detalhes de uma area operacional especifica pelo identificador local.
                    A resposta inclui o GeoJSON armazenado em coordinatesJson, que pode ser usado pelo frontend para renderizar
                    a area em mapa, alem de tipo, equipes atribuidas, alertas de entrada/saida e datas de auditoria.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Area operacional encontrada e retornada com seus dados completos.",
                    content = @Content(schema = @Schema(implementation = GeofenceResponseDTO.class))
            ),
            @ApiResponse(responseCode = "404", description = "Area operacional nao encontrada", content = @Content)
    })
    public ResponseEntity<GeofenceResponseDTO> findById(
            @Parameter(
                    description = "Identificador local da area operacional. E usado internamente para consultar detalhes e abrir o mapa da area.",
                    example = "seed_geofence_001",
                    required = true
            )
            @PathVariable String id
    ) {
        return ResponseEntity.ok(geofenceService.findById(id));
    }

    @GetMapping("/type/{type}")
    @Operation(
            summary = "Listar areas operacionais por tipo",
            description = """
                    Retorna areas operacionais filtradas pelo tipo geografico.
                    Use POLYGON para areas representadas por poligonos e CIRCLE para areas circulares.
                    A resposta segue o mesmo formato da listagem geral e pode ser usada para filtros operacionais no frontend.
                    """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de areas operacionais do tipo informado retornada com sucesso. Pode retornar lista vazia.",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = GeofenceResponseDTO.class)))
            )
    })
    public ResponseEntity<List<GeofenceResponseDTO>> findByType(
            @Parameter(
                    description = "Tipo da area operacional. Valores aceitos: POLYGON ou CIRCLE.",
                    example = "POLYGON",
                    required = true
            )
            @PathVariable GeofenceType type
    ) {
        return ResponseEntity.ok(geofenceService.findByType(type));
    }

    @PostMapping("/sync")
    @Operation(
            summary = "Sincronizar areas operacionais",
            description = """
                    Executa manualmente a sincronizacao das areas operacionais com a API externa.
                    O backend consome a API externa com WebClient, persiste ou atualiza registros locais por externalId
                    e registra o historico da execucao em SyncExecution. Esse endpoint nao retorna corpo em caso de sucesso.
                    """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Sincronizacao executada com sucesso, sem corpo de resposta", content = @Content),
            @ApiResponse(responseCode = "409", description = "Conflito detectado entre id local e externalId durante a sincronizacao", content = @Content),
            @ApiResponse(responseCode = "502", description = "Erro ao consumir a API externa", content = @Content)
    })
    public ResponseEntity<Void> syncGeofences() {
        geofenceSyncService.syncGeofences();

        return ResponseEntity.noContent().build();
    }
}
