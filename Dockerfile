FROM azul/zulu-openjdk:17

MAINTAINER LightSwitch <lightswitch2024@gmail.com> 

# backend build output copy
ARG JAR_FILE=backend/core-service/build/libs/*.jar
COPY ${JAR_FILE} home/conf/app.jar

# frontend build output copy
ARG WEB_PATH=frontend/dist
COPY $WEB_PATH var/www/html/.


RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime

RUN apt-get update && \
apt-get install -y wget gnupg && \
wget -qO - https://www.postgresql.org/media/keys/ACCC4CF8.asc | gpg --dearmor | tee /usr/share/keyrings/postgresql.gpg > /dev/null && \
. /etc/os-release && \ 
echo "deb [signed-by=/usr/share/keyrings/postgresql.gpg] http://apt.postgresql.org/pub/repos/apt ${VERSION_CODENAME}-pgdg main" | tee /etc/apt/sources.list.d/pgdg.list && \
apt-get update && \
apt-get install sudo -y && \
apt-get install -y nginx&& \
apt-get install -y postgresql-16 && \
apt-get install -y git

COPY ./database-setup.sql /home/conf/database-setup.sql
COPY ./install.sh /home/conf/install.sh


ENTRYPOINT [ "bin/bash", "home/conf/install.sh" ]
