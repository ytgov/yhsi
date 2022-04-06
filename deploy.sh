git fetch
git reset --hard origin/test
docker-compose -f docker-compose.test.yml build
docker-compose -f docker-compose.test.yml up -d
