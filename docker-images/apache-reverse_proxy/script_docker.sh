cd docker-images/apache-reverse_proxy/

docker build -t res/apache_rp .
docker run -p 8080:80 res/apache_rp