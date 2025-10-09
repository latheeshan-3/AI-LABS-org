# ---------- Build Stage ----------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

# Copy Maven wrapper and config
COPY mvnw pom.xml ./
COPY .mvn .mvn

# ✅ Give execution permission to mvnw
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source and build
COPY src src
RUN ./mvnw clean package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app

# Copy built jar file from builder stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 5000

# Environment variables
ENV SPRING_APPLICATION_NAME=java-backend
ENV SERVER_PORT=5000
ENV SERVER_ADDRESS=0.0.0.0

# ✅ Correct entrypoint for Render
CMD ["sh", "-c", "java -jar app.jar --server.port=${SERVER_PORT:-5000}"]
