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
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.ResponseSpec;
import reactor.core.Exceptions;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;


@Component
@AllArgsConstructor
public class MediaApiClient {

    private final WebClient webClient;

    public Mono<ExternalAgentsResponseDTO> findAgents() {
        return withExternalApiErrorHandling(webClient.get()
                .uri("/api/v1/agents/")
                .retrieve())
                .bodyToMono(ExternalAgentsResponseDTO.class)
                .retryWhen(externalApiRetry());
    }

    private boolean isRetryable(Throwable error) {
        if (!(error instanceof ExternalApiException exception)) {
            return false;
        }

        return exception.getStatusCode() == 429
                || exception.getStatusCode() == 503
                || exception.getStatusCode() >= 500;
    }

    public Mono<ExternalAgentLocationsResponseDTO> findLocations() {
        return withExternalApiErrorHandling(webClient.get()
                .uri("/api/v1/locations/")
                .retrieve())
                .bodyToMono(ExternalAgentLocationsResponseDTO.class)
                .retryWhen(externalApiRetry());
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
                .retryWhen(externalApiRetry());
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
                .retryWhen(externalApiRetry());
    }

    public Mono<ExternalSyncResponseDTO> triggerGeofencesSync() {
        return triggerSimpleSync("/api/v1/sync/geofences");
    }

    public Mono<ExternalGeofencesResponseDTO> findGeofences() {
        return withExternalApiErrorHandling(webClient.get()
                .uri("/api/v1/geofences/")
                .retrieve())
                .bodyToMono(ExternalGeofencesResponseDTO.class)
                .retryWhen(externalApiRetry());
    }

    public Mono<ExternalFullSyncResponseDTO> triggerFullSync() {
        return withExternalApiErrorHandling(webClient.post()
                .uri("/api/v1/sync/all")
                .retrieve())
                .bodyToMono(ExternalFullSyncResponseDTO.class)
                .retryWhen(externalApiRetry());
    }

    private Mono<ExternalSyncResponseDTO> triggerSimpleSync(String path) {
        return withExternalApiErrorHandling(webClient.post()
                .uri(path)
                .retrieve())
                .bodyToMono(ExternalSyncResponseDTO.class)
                .retryWhen(externalApiRetry());
    }

    private ResponseSpec withExternalApiErrorHandling(ResponseSpec responseSpec) {
        return responseSpec
                .onStatus(
                        status -> status.value() == 429,
                        response -> Mono.error(new ExternalApiException(
                                "External API rate limit exceeded",
                                429,
                                parseRetryAfter(response.headers().asHttpHeaders().getFirst(HttpHeaders.RETRY_AFTER))
                        ))
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

    private Retry externalApiRetry() {
        return Retry.from(retrySignals -> retrySignals.concatMap(retrySignal -> {
            Throwable failure = retrySignal.failure();

            if (!isRetryable(failure) || retrySignal.totalRetries() >= 3) {
                return Mono.error(Exceptions.retryExhausted("Retries exhausted: 3/3", failure));
            }

            return Mono.delay(getRetryDelay(failure, retrySignal.totalRetries()));
        }));
    }

    private Duration getRetryDelay(Throwable failure, long retryAttempt) {
        if (failure instanceof ExternalApiException exception
                && exception.getStatusCode() == 429
                && exception.getRetryAfter() != null
                && !exception.getRetryAfter().isNegative()
                && !exception.getRetryAfter().isZero()) {
            return exception.getRetryAfter();
        }

        return Duration.ofSeconds(2L * (long) Math.pow(2, retryAttempt));
    }

    private Duration parseRetryAfter(String retryAfterHeader) {
        if (retryAfterHeader == null || retryAfterHeader.isBlank()) {
            return null;
        }

        try {
            long seconds = Long.parseLong(retryAfterHeader.trim());
            return Duration.ofSeconds(seconds);
        } catch (NumberFormatException ignored) {
            return parseRetryAfterDate(retryAfterHeader);
        }
    }

    private Duration parseRetryAfterDate(String retryAfterHeader) {
        try {
            ZonedDateTime retryAt = ZonedDateTime.parse(
                    retryAfterHeader.trim(),
                    DateTimeFormatter.RFC_1123_DATE_TIME
            );

            Duration delay = Duration.between(ZonedDateTime.now(retryAt.getZone()), retryAt);
            return delay.isNegative() ? Duration.ZERO : delay;
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }
}
