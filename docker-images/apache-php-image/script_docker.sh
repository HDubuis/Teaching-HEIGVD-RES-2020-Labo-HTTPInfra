cd docker-images/apache-php-image/
docker build -t res/apache_php .
docker run -p 9090:80 res/apache_php