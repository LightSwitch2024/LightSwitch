service postgresql start
service nginx start
sudo -u postgres psql -f home/conf/database-setup.sql
# psql -U postgres -f home/conf/database-setup.sql

java -jar -Duser.timezone=Asia/Seoul home/conf/app.jar
