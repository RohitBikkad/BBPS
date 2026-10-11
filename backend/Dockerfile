# Multi-stage build for Spring Boot Backend
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app

# Copy maven wrapper / pom.xml
COPY pom.xml .
COPY src ./src

# Install maven and package
RUN apk add --no-cache maven && mvn clean package -DskipTests

# Runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S bbpsgroup && adduser -S bbpsuser -G bbpsgroup
USER bbpsuser

COPY --from=build /app/target/bbps-staff-portal-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
