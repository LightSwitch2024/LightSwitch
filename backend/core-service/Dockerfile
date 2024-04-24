FROM azul/zulu-openjdk:17

MAINTAINER LightSwitch <lightswitch2024@gmail.com> 

ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java", "-Dspring.profiles.active=production", "-jar", "/app.jar"]

RUN \
    apt-get update && \
    apt-get install -y vim \
