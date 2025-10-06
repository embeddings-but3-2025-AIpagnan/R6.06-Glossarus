# Application-Glossaire
Glossaire intelligent avec interface graphique 

Pour faite cette application nous utiliserons FastAPI, qui est un framework web pour Python, conçu pour créer des API.


Instalation : 

Pour pouvoir utiliser ce framework, il faut l’installer.

Ouvrez un terminal et tapez la commande suivante : pip install fastapi[all]
Cette commande permet d’installer FastAPI et Uvicorn en même temps. Uvicorn est le serveur recommandé pour exécuter les applications FastAPI.

Une fois que FastAPI est installé, vous pouvez lancer le projet avec la commande suivante : : uvicorn [nom du fichier]:[nom de l'objet FastAPI]
Vous pouvez égalment ajouter l'option --reload à la fin de la commande, pour recharger automatiquement le serveur à chaque modification du code.

Exemple : uvicorn main:app --reload

- main : c’est le nom du fichier Python (sans le .py)
- app : c’est le nom de l’objet FastAPI défini dans ce fichier. Dans main.py, il y aura donc : app = FastAPI()

Donc main:app signifie : "Cherche dans le fichier main.py, l’objet nommé app."
Le nom app pour l’objet FastAPI fait partie des conventions.
