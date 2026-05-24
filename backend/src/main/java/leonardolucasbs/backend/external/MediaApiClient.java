package leonardolucasbs.backend.external;

import leonardolucasbs.backend.checkin.dto.ExternalCheckInsResponseDTO;
import leonardolucasbs.backend.checkin.enums.CheckInType;
import leonardolucasbs.backend.external.dto.ExternalCheckInSyncResponseDTO;
import leonardolucasbs.backend.external.dto.ExternalFullSyncResponseDTO;
import leonardolucasbs.backend.external.dto.ExternalAgentLocationsResponseDTO;
import leonardolucasbs.backend.external.dto.ExternalAgentsResponseDTO;
import leonardolucasbs.backend.common.exception.ExternalApiException;
import leonardolucasbs.backend.external.dto.ExternalSyncResponseDTO;
import leonardolucasbs.backend.geofence.dto.ExternalGeofencesResponseDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.ResponseSpec;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;


@Component
@AllArgsConstructor
public class MediaApiClient {

    private final WebClient webClient;

    public Mono<ExternalAgentsResponseDTO> findAgents(int page, int size, String syncToken) {
        return withExternalApiErrorHandling(webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder
                            .path("/api/v1/agents")
                            .queryParam("page", page)
                            .queryParam("size", size);

                    if (syncToken != null && !syncToken.isBlank()) {
                        builder.queryParam("syncToken", syncToken);
                    }

                    return builder.build();
                })
                .retrieve())
                .bodyToMono(ExternalAgentsResponseDTO.class)
                .retryWhen(
                        Retry.backoff(3, Duration.ofSeconds(2))
                                .filter(this::isRetryable)
                );
    }

    private boolean isRetryable(Throwable error) {
        if (!(error instanceof ExternalApiException exception)) {
            return false;
        }

        return exception.getStatusCode() == 429
                || exception.getStatusCode() == 503
                || exception.getStatusCode() >= 500;
    }

    public Mono<ExternalAgentLocationsResponseDTO> findLocations(int page, int size, String syncToken) {
        return withExternalApiErrorHandling(webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder
                            .path("/api/v1/locations")
                            .queryParam("page", page)
                            .queryParam("size", size);

                    if (syncToken != null && !syncToken.isBlank()) {
                        builder.queryParam("syncToken", syncToken);
                    }

                    return builder.build();
                })
                .retrieve())
                .bodyToMono(ExternalAgentLocationsResponseDTO.class)
                .retryWhen(
                        Retry.backoff(3, Duration.ofSeconds(2))
                                .filter(this::isRetryable)
                );
    }

    public Mono<ExternalCheckInsResponseDTO> findCheckIns(String agentId, CheckInType type) {
        return withExternalApiErrorHandling(webClient.get()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/api/v1/check-ins/");

                    if (agentId != null && !agentId.isBlank()) {
                        builder.queryParam("agentId", agentId);
                    }

                    if (type != null) {
                        builder.queryParam("type", type);
                    }

                    return builder.build();
                })
                .retrieve())
                .bodyToMono(ExternalCheckInsResponseDTO.class)
                .retryWhen(
                        Retry.backoff(3, Duration.ofSeconds(2))
                                .filter(this::isRetryable)
                );
    }

    public Mono<ExternalSyncResponseDTO> triggerAgentsSync() {
        return triggerSimpleSync("/api/v1/sync/agents");
    }

    public Mono<ExternalSyncResponseDTO> triggerLocationsSync() {
        return triggerSimpleSync("/api/v1/sync/locations");
    }

    public Mono<ExternalCheckInSyncResponseDTO> triggerCheckInsSync(String syncToken) {
        return withExternalApiErrorHandling(webClient.post()
                .uri(uriBuilder -> {
                    var builder = uriBuilder.path("/api/v1/sync/check-ins");

                    if (syncToken != null && !syncToken.isBlank()) {
                        builder.queryParam("syncToken", syncToken);
                    }

                    return builder.build();
                })
                .retrieve())
                .bodyToMono(ExternalCheckInSyncResponseDTO.class)
                .retryWhen(
                        Retry.backoff(3, Duration.ofSeconds(2))
                                .filter(this::isRetryable)
                );
    }

    public Mono<ExternalSyncResponseDTO> triggerGeofencesSync() {
        return triggerSimpleSync("/api/v1/sync/geofences");
    }

    public Mono<ExternalGeofencesResponseDTO> findGeofences() {
        return withExternalApiErrorHandling(webClient.get()
                .uri("/api/v1/geofences/")
                .retrieve())
                .bodyToMono(ExternalGeofencesResponseDTO.class)
                .retryWhen(
                        Retry.backoff(3, Duration.ofSeconds(2))
                                .filter(this::isRetryable)
                );
    }

    public Mono<ExternalFullSyncResponseDTO> triggerFullSync() {
        return withExternalApiErrorHandling(webClient.post()
                .uri("/api/v1/sync/all")
                .retrieve())
                .bodyToMono(ExternalFullSyncResponseDTO.class)
                .retryWhen(
                        Retry.backoff(3, Duration.ofSeconds(2))
                                .filter(this::isRetryable)
                );
    }

    private Mono<ExternalSyncResponseDTO> triggerSimpleSync(String path) {
        return withExternalApiErrorHandling(webClient.post()
                .uri(path)
                .retrieve())
                .bodyToMono(ExternalSyncResponseDTO.class)
                .retryWhen(
                        Retry.backoff(3, Duration.ofSeconds(2))
                                .filter(this::isRetryable)
                );
    }

    private ResponseSpec withExternalApiErrorHandling(ResponseSpec responseSpec) {
        return responseSpec
                .onStatus(
                        status -> status.value() == 429,
                        response -> Mono.error(
                                new ExternalApiException("External API rate limit exceeded", 429)
                        )
                )
                .onStatus(
                        status -> status.value() == 503,
                        response -> Mono.error(
                                new ExternalApiException("External API is temporarily unavailable", 503)
                        )
                )
                .onStatus(
                        status -> status.is4xxClientError(),
                        response -> Mono.error(
                                new ExternalApiException("Client error while consuming external API", response.statusCode().value())
                        )
                )
                .onStatus(
                        status -> status.is5xxServerError(),
                        response -> Mono.error(
                                new ExternalApiException("Server error while consuming external API", response.statusCode().value())
                        )
                );
    }
}
