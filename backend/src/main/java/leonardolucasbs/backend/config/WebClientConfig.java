package leonardolucasbs.backend.config;

import leonardolucasbs.backend.external.MediaApiProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient mediaApiWebClient(
            WebClient.Builder builder,
            MediaApiProperties properties
    ) {
        return builder
                .baseUrl(properties.baseUrl())
                .defaultHeader("x-api-key", properties.apiKey())
                .build();
    }
}