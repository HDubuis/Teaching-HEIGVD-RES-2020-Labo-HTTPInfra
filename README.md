
# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

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
1) Cloner le repo
2) Lancer le script ./docker-images/express-image/script_docker.sh
3) Soit se connecter via telnet au container et lui envoyer `GET / HTTP/1.1`, soit à nouveau sur localhost:9090 dans le navigateur. (Si vous utilisez autre chose que Docker Desktop for Windows remplace localhost par celle correspondant à votre Docker)
