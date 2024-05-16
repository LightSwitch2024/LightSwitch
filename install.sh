service postgresql start

sudo -u postgres psql -f /home/conf/database-setup.sql

domain="$DOMAIN"
echo "도메인: $domain"

git clone https://github.com/LightSwitch-S202/LightSwitch.git
cd /LightSwitch

cd ./backend/core-service
./graldew clean assemble
cd ./build/libs
jar_file=$(ls *.jar)
echo "실행할 .jar 파일: $jar_file"
nohup java -jar $jar_file -DSpring.cors.domain=$domain &
cd /LightSwitch

'' frontend build
cd ./frontend
echo VITE_SERVER_BASEURL=$domain > .env
yarn install
yarn build
cp -r /LightSwitch/frontend/dist/* /var/www/html

service nginx start
