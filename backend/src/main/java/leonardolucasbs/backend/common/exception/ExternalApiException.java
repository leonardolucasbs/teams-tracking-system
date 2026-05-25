package leonardolucasbs.backend.common.exception;

import java.time.Duration;

public class ExternalApiException extends RuntimeException {

    private final int statusCode;
    private final Duration retryAfter;

    public ExternalApiException(String message, int statusCode) {
        this(message, statusCode, null);
    }

    public ExternalApiException(String message, int statusCode, Duration retryAfter) {
        super(message);
        this.statusCode = statusCode;
        this.retryAfter = retryAfter;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public Duration getRetryAfter() {
        return retryAfter;
    }
}
