# ---------- Build Stage ----------
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app

COPY mvnw pom.xml ./
COPY .mvn .mvn
RUN ./mvnw dependency:go-offline -B

COPY src src
RUN ./mvnw clean package -DskipTests

# ---------- Runtime Stage ----------
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 5000
ENV SPRING_APPLICATION_NAME=java-backend
ENV SERVER_PORT=5000
ENV SERVER_ADDRESS=0.0.0.0

CMD ["sh", "-c", "java -jar app.jar --server.port=${SERVER_PORT:-5000}"]

