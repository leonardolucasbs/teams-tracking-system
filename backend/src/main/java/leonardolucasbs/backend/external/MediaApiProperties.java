package leonardolucasbs.backend.external;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "media-api")
public record MediaApiProperties(
        String baseUrl,
        String apiKey
) {
}