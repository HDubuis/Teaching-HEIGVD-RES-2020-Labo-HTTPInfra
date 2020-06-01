
# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

## Partie 5

Dans cette partie, le but est de régler notre problème d'adresse IP inscrite en dur dans notre container qui se charge du reverse proxy. Pour ce faire, nous allons modifier son dockerfile, modifié le ficher apache2_foreground utiliser par l'image que nous utilisons, et écrire un peu de php. Voici le nouveau dockerfile :

    FROM php:7.2-apache
    
    RUN apt-get update && apt-get install -y vim
    
    COPY apache2-foreground /usr/local/bin
    COPY templates /var/apache2/templates
    COPY conf/ /etc/apache2
    
    RUN a2enmod proxy proxy_http
    RUN a2ensite 000-* 001-*

Nous copions désormais notre fichier apache2-foreground, et notre dossier templates qui contient notre code php.
Dans apache2-foreground nous avons ajouter

    echo "Setup for the RES lab..."
    echo "Static App URL :"$STATIC_APP
    echo "Dynamic App URL :"$DYNAMIC_APP
    
    php /var/apache2/templates/config-template.php > /etc/apache2/sites-available/001-reverse-proxy.conf
    
Les trois échos sont là juste pour nous informer que nos ajouts fonctionne et que nous avons accès aux variable d'environnement STATIC_APP et DYNAMIC_APP, enfin la dernière ligne lance notre code php et écrit son résultat dans le fichier 001-reverse-proxy.conf.

    <?php
    	$ip_static = getenv('STATIC_APP');
    	$ip_dynamic = getenv('DYNAMIC_APP');
    ?>
    
    <VirtualHost *:80>
    	ServerName demo.res.ch
    
    	ProxyPass '/api/students/' 'http://<?php print "$ip_dynamic"?>/'
    	ProxyPassReverse '/api/students/' 'http://<?php print "$ip_dynamic"?>/'
    
    	ProxyPass '/' 'http://<?php print "$ip_static"?>/'
    	ProxyPassReverse '/' 'http://<?php print "$ip_static"?>/'
    </VirtualHost>
    
Ce code, nous permet de récupérer les variables d'environnement qui nous intéresse, et de les écrire où nous le souhait dans notre fichier de configuration.
Enfin, grâce à cela, nous pouvons lancer notre reverse proxy, en lui donnant lui passant les adresse ip comme des variable d'environnement.

###Test 
Pour tester l’implémentation il faut :
1)	Cloner le repo
2)	Lancer le script ./Static+dynamic.sh
3) 	Regarder les adresses ip avec `docker  inspect express_dynamic |grep -i ipaddress` et `docker inspect apache_static |grep -i ipaddress`
4)	Lance `docker run -d -p 8080:80 -e STATIC_APP=adresse ip de apache_static:80 -e DYNAMIC_APP=adresse ip de express_dynamic:3000 --name apache_rp res/apache_rp` (par exemple docker run -d -p 8080:80 -e STATIC_APP=172.17.0.2:80 -e DYNAMIC_APP=172.17.0.4:3000 --name apache_rp res/apache_rp)
