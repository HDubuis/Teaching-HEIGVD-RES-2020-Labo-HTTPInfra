cd docker-images/express-image/

docker build -t res/express_animals .
docker run -d -p 9090:3000 res/express_animals