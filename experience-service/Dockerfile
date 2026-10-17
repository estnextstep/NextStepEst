# experience-service/Dockerfile
FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

# Copy the built JAR
COPY target/experience-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8083

ENTRYPOINT ["java","-jar","app.jar"]