# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM eclipse-temurin:21-jdk AS build
WORKDIR /app

# Warm the Gradle cache with just the build scripts first (better layer caching).
COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle ./gradle
RUN chmod +x gradlew && ./gradlew --no-daemon dependencies > /dev/null 2>&1 || true

COPY src ./src
RUN ./gradlew --no-daemon clean bootJar

# ---- Runtime stage ----
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
# Keep the JVM footprint small for the Raspberry Pi.
ENV JAVA_OPTS="-Xmx256m -XX:MaxRAMPercentage=75"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
