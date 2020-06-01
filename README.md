
# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

## Partie 3

Dans cette partie, nous utilisons le dockerfile suivant  :

    FROM php:7.2-apache
    
    COPY conf/ /etc/apache2
    
    RUN a2enmod proxy proxy_http
    RUN a2ensite 000-* 001-*

Grâce à ce dernier, nous créons une image php-apache dans laquelle nous allons configurer apache pour faire un reverse proxy. Pour cela, nous avons besoin de copier des fichiers de notre machine au container (via la deuxième ligne). Les fichiers en questions sont 000-default.conf et 001-reverse-proxy.conf, ils permettent (surtout le deuxième) de mapper les requêtes qui sont envoyées à notre serveur.
Finalement pour que ça fonctionne d'apache afin d'activer la configuration, a2enmod permet d'enable les deux module dont nous avons besoin, et a2ensite, enable nos sites.

Pour tester l’implémentation il faut :
1)	Aller sur la branche fb-apache-reverse-proxy
2)  Lancer deux containers, si vous avez fait les étapes précédentes contenu dans ce repo. Lancer :

          docker run -d --name apache_static res/apache_php
          docker run -d --name express_dynamic res/express_animals

3)	Avec les commandes :

          docker inspect express_dynamic |grep -i ipaddress
          docker inspect apache_static |grep -i ipaddress
          
Récupérer les adresses ip des deux containers ainsi lancés.

4)  Dans le fichier docker-images\apache-reverse_proxy\conf\sites-available\001-reverse-proxy.conf, changer les ip en fonction des résultat obtenus.

5)  Lancer le script ./docker-images/apache-reverse_proxy/script_docker.sh


/!\Nous avons du hardcoder les adresses dans le fichier 001-reverse-proxy.conf, si les containers sont arrêter et relancer, cela a des bonnes chances de ne pas fonctionner (docker attribue dynamiquement les adresses)
