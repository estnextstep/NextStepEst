FROM eclipse-temurin:21-jdk-alpine

WORKDIR /app

COPY target/email-notification-service-0.0.1-SNAPSHOT.jar app.jarcd

EXPOSE 8081

ENTRYPOINT ["java","-jar","app.jar"]