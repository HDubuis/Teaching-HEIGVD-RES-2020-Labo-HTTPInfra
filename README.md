
# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

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

###Test

Pour tester l’implémentation, il faut :
1) Cloner le repo
2) Lancer le script ./all.sh
3) Normalement, toutes les machines ont été créées. Attention, les adresses étant écrites en dur pour le reverse proxy, il pourrait y avoir des soucis. Si c'est le cas, il faut modifier le fichier 001-reverse-proxy.conf du reverse proxy (voir étape 3).

4) Si vous avez modifié votre fichier host a l'étape précédente vous devriez pouvoir voir le site en fonction ici : http://demo.res.ch:8080/