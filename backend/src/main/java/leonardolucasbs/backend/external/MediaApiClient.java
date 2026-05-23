package leonardolucasbs.backend.external;

import leonardolucasbs.backend.external.dto.ExternalAgentsResponseDTO;
import leonardolucasbs.backend.common.exception.ExternalApiException;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;


@Component
public class MediaApiClient {

    private final WebClient webClient;

    public MediaApiClient(WebClient mediaApiWebClient) {
        this.webClient = mediaApiWebClient;
    }

    public Mono<ExternalAgentsResponseDTO> findAgents(int page, int size, String syncToken) {
        return webClient.get()
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
                .retrieve()
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
                )
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
}