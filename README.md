# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

## Partie 1

Dans cette partie, en suivant le webcast, nous avons commencé par créer l’arborescence de notre projet, puis nous avons crée une dockerfile contenant ces deux lignes :

    FROM php:7.2-apache
    COPY content/ /var/www/html/

La première va récupérer l’image php-apache, et la deuxième copie le contenu du dossier content de l’hôte vers le /var/www/html/ du container.
Les fichiers de configurations d'apache, dans le container, sont situé dans /etc/apache2/

Le thème utiliser vient de https://startbootstrap.com/themes/ et la base du dockerfile de https://hub.docker.com/_/php/ .

Pour tester l’implémentation, il faut :
1) Cloner le repo aller sur la branche fb-apache-static
2) Lancer le script .\docker-images\apache-php-image\script_docker.sh
3) Ouvrir un navigateur et allers à l'adresse de docker:9090 (sur Docker Desktop for Windows localhost:9090)

## Partie 2


Dans cette partie, en suivant le webcast, nous avons commencé par ajouter des dossiers à l’arborescence de notre projet, puis nous avons crée le dockerfile suivant :

    FROM node:12.17
    COPY src/ /opt/app
    CMD ["node", "/opt/app/index.js"]

La dernière ligne permet à ce qu'on lance notre application node contenu dans index.js, au lancement du container.
Ensuite, nous avons écrit une courte application qui génère aléatoirement des animaux grâce au module "chance" puis faisons une fonction grâce au module "express".

````
    var Chance = require('chance');
    var chance = new Chance();

    var express = require('express');
    var app = express();

    app.get('/test', function(req,res){
        res.send("Hello again - test is working");
    });

    app.get('/', function(req,res){
        res.send(generateAnimals());
    });

    app.listen(3000, function(){
        console.log('Accepting HTTP requests on port 3000');
    });

    function generateAnimals(){
        var numberOfAnimals = chance.integer({
        min: 1,
        max : 5
        });
        console.log(numberOfAnimals);
        var animals = [];
        for(var i = 0; i < numberOfAnimals; i++){
            animals.push({
                race: chance.animal(),
                name: chance.first(),
                gender: chance.gender()
            });
        };

        console.log(animals);
        return animals;
    }
````

Pour tester l’implémentation, il faut :
1) Cloner le repo et aller sur la branche fb-express-dynamic
2) Lancer le script ./docker-images/express-image/script_docker.sh
3) Soit se connecter via telnet au container et lui envoyer `GET / HTTP/1.1`, soit à nouveau sur localhost:9090 dans le navigateur. (Si vous utilisez autre chose que Docker Desktop for Windows remplace localhost par celle correspondant à votre Docker)

## Partie 3

Dans cette partie, nous utilisons le dockerfile suivant  :

    FROM php:7.2-apache
    
    COPY conf/ /etc/apache2
    
    RUN a2enmod proxy proxy_http
    RUN a2ensite 000-* 001-*

Grâce à ce dernier, nous créons une image php-apache dans laquelle nous allons configurer apache pour faire un reverse proxy. Pour cela, nous avons besoin de copier des fichiers de notre machine au container (via la deuxième ligne). Les fichiers en questions sont 000-default.conf et 001-reverse-proxy.conf, ils permettent (surtout le deuxième) de mapper les requêtes qui sont envoyées à notre serveur.
Finalement pour que ça fonctionne d'apache afin d'activer la configuration, a2enmod permet d'enable les deux module dont nous avons besoin, et a2ensite, enable nos sites.


### Test
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

## Partie 4

Le but de cette partie était d'utiliser AJAX et JQuery pour modifier dynamiquement le contenu d'une page hébergée dans un de nos containers, derrière le reverse proxy. 
Toutefois, nous avons commencé par modifier tout nos dockerfile pour y ajouter ceci :

    RUN apt-get update && \
	apt-get install -y vim


Cela a pour but qu'ils installent vim à leur lancement. 
Puis nous avons modifié les fichiers de la machine faits à partir de l'image apache_php. Dans le fichier HTML, nous avons ajouté de quoi charger un script de plus, et nous avons écrit le fameux script, dont voici le code :

    $(function(){
    	console.log("Loading animals");
    	
    	function loadAnimals(){
    		$.getJSON( "/api/students/", function( animals ){
    			console.log(animals);
    			var message = "It's a quiet place here";
    			if(animals.length > 0){
    				message = "Oh look, it's "+animals[0].name+", the "+animals[0].race;
    			}
    			$(".masthead-heading").text(message);
    		});
    	};
    	loadAnimals;
    	setInterval( loadAnimals, 2000);
    });

Grâce à ce dernier, notre page d'accueil a, désormais, un texte changeant, dont le contenu vient en partie de notre containers express_dynamic.

### Test

Pour tester l’implémentation, il faut :
1) Aller sur la branche fb-ajax-jquery
2) Lancer le script ./all.sh
3) Normalement, toutes les machines ont été créées. Attention, les adresses étant écrites en dur pour le reverse proxy, il pourrait y avoir des soucis. Si c'est le cas, il faut modifier le fichier 001-reverse-proxy.conf du reverse proxy (voir étape 3).

4) Si vous avez modifié votre fichier host a l'étape précédente vous devriez pouvoir voir le site en fonction ici : http://demo.res.ch:8080/


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

### Test
Pour tester l’implémentation il faut :
1)	Aller sur la branche fb-dynamic-configuration
2)	Lancer le script ./Static+dynamic.sh
3) 	Regarder les adresses ip avec `docker  inspect express_dynamic |grep -i ipaddress` et `docker inspect apache_static |grep -i ipaddress`
4)	Lance `docker run -d -p 8080:80 -e STATIC_APP=adresse ip de apache_static:80 -e DYNAMIC_APP=adresse ip de express_dynamic:3000 --name apache_rp res/apache_rp` (par exemple docker run -d -p 8080:80 -e STATIC_APP=172.17.0.2:80 -e DYNAMIC_APP=172.17.0.4:3000 --name apache_rp res/apache_rp)
