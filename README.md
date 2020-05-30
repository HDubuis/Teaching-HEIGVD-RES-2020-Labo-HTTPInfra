
# Teaching-HEIGVD-RES-2020-Labo-HTTPInfra

## Partie 1

Dans cette partie, en suivant le webcast, nous avons commencé par ajouter des doosiers à l’arborescence de notre projet, puis nous avons crée le dockerfile suivant :

    FROM node:12.17
    COPY src/ /opt/app
    CMD ["node", "/opt/app/index.js"]

La dernière ligne permet à ce qu'on lance notre application node contenu dans index.js, au lancement du container.
Ensuite nous avons écrit une courte application qui génère aléatoirement des élèves.

Pour tester l’implémentation il faut :
1)	Cloner le repo
2)	Lancer le script ./docker-images\express-image\script_docker.sh
3)  Soit se connecter via telnet au container et lui envoyer `GET / HTTP/1.1`
Soit alors sur localhost:9090 dans le navigateur.
