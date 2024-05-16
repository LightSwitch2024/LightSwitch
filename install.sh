service postgresql start

git clone

'' backend build
cd /backend/core-service
#dev-yml 수정
./graldew clean assemble
cd ./build/libs


'' frontend build
.env 수정
yarn install
yarn build

cp

service nginx start
sudo -u postgres psql -f /home/conf/database-setup.sql
#psql -U postgres -f /home/conf/database-setup.sql

java -jar -Duser.timezone=Asia/Seoul /home/conf/app.jar
