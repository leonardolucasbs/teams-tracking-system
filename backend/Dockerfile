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
RUN ./gradlew clean build -x test

# Runtime stage
FROM eclipse-temurin:21-jre-alpine

# Install mysql-client for healthchecks (optional but useful)
RUN apk add --no-cache mysql-client

WORKDIR /app

# Copy the built JAR from builder stage
COPY --from=builder /workspace/build/libs/*.jar app.jar

# Expose port
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD java -cp app.jar org.springframework.boot.loader.PropertiesLauncher \
      -Dspring.profiles.active=health || exit 1

# Run the JAR
ENTRYPOINT ["java", "-jar", "app.jar"]
