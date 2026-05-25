# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /workspace

# Copy gradle wrapper
COPY gradlew .
COPY gradle gradle
COPY build.gradle .
COPY settings.gradle .

# Copy source code
COPY src src

# Build the application
RUN chmod +x gradlew && ./gradlew clean build -x test

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Install curl for healthchecks
RUN apk add --no-cache curl

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /workspace/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:8080/actuator/health || exit 1

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
