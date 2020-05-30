# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

## Partie 1

Dans cette partie, en suivant le webcast, nous avons commencé par crée l’arborescence de notre projet, puis nous avons crée une dockerfile contenant ces deux lignes :

    FROM php:7.2-apache
    COPY content/ /var/www/html/

La première va récupérer l’image php-apache, et la deuxième copie le contenu du dossier content de l’hôte vers le /var/www/html/ du container.

Le thème utiliser vient de https://startbootstrap.com/themes/ et la base du dockerfile de https://hub.docker.com/_/php/ .

Pour tester l’implémentation il faut :
1)	Cloner le repo
2)	Lancer le script ./docker-images\apache-php-image\script_docker.sh
