# On tue les trois machines
docker kill apache_static
docker kill express_dynamic
docker kill apache_rp

# Puis on les remove
docker rm apache_static
docker rm express_dynamic
docker rm apache_rp

# On rebuild les trois images
cd ./docker-images/apache-php-image/
bash ./build_image.sh
cd ..

cd ./express-image
bash ./build_image.sh

cd ..
cd ./docker-images/apache-reverse-proxy/
bash ./build_image.sh

# On lance les trois containers
docker run -d --name apache_static res/apache_php
docker run -d --name express_dynamic res/express_animals
docker run -d -p 8080:80 --name apache_rp res/apache_rp