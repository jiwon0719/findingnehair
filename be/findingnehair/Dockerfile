FROM openjdk:17-jdk-slim

WORKDIR /app

COPY build/libs/*SNAPSHOT.jar app.jar

CMD ["java", "-Duser.timezone=Asia/Seoul", "-jar", "app.jar"]
