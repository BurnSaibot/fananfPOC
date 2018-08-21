== L'application ==

Elle a été réalisée en utilisant nodejs, mongoDB, express et ejs. 

=== Ce qui a été fait ===

*L’utilisateur peut s'enregistrer ( il est alors automatiquement connecté, pas de vérification par mail pour le moment)
*L'utilisateur se voit affecté à un groupe personnel lorsqu'il s'enregistre.
*L'utilisateur peut consulter une liste des membres.
*L'utilisateur peut consulter le profile d'un membre ( pour le moment, il n'y a que le nom + prenom associé).
*L'utilisateur peut ajouter une transcription en téléversant la vidéo concernée en sélectionnant le format de fichier de sous-titres voulu, et le groupe de travail pour lequel il upload la video.
*L'utilisateur peut voir la liste des transcription auxquelles il a accès, c'est à dire, toutes les transcriptions de tous les groupes auxquels il appartient.
*L'utilisateur peut consulter la liste des sous-titres générés pour une transcription donnée.
*L'utilisateur peut consulter un sous-titre.
*L'utilisateur peut éditer un sous-titre.
*L'utilisateur peut exporter un sous-titre.

=== Ce qu'il faudrait ajouter ===

*La possibilité pour un utilisateur de créer un groupe de travail (pour le moment seuls les groupes personnels sont disponibles).
*La possibilité d'ajouter des utilisateurs à un groupe de travail.
*La possibilité d'enlever un utilisateur d'un groupe de travail. 
*La possibilité pour un utilisateur de quitter un groupe de travail.
*L'ajout de rôles au sein d'un groupe, pour par exemple permettre seulement à un stagiaire d'upload des vidéos et de consulter des sous-titres.
*L'ajout de css, pour le moment l'application est en html brut, sans style, voire changer la méthode de rendu (j'ai utilisé ejs parce que simple d'utilisation à la base, et parce que c'était ce qui était proposé dans les différents cours/tutoriels pour apprendre à utiliser nodejs).
*L'ajout de la lecture de la vidéo durant l'édition (qui semble complexe à mettre en place avec ejs).
*Mettre en place un reverse proxy quand on mettra l'application en ligne, comme demandé par l'AMIC.
*Ajouter une correction sécurisée.
*Ajouter un fil d’Ariane pour que l'application soit plus accessible. 
*Peut être revoir l'architecture de l'application même si j'ai essaye de bien faire
*Modifier le script utilisé pour générer les sous-titres et l'application pour qu'on puisse sélectionner la langue de la vidéo à transcrire, pour le moment le mode par défaut (et obligatoire) est français. Or dans la plupart des domaines, une majorité des ressources sont en anglais. Les sous-titres générés seront par contre en anglais (pas possible de faire autrement pour le moment avec vocapia).
*Faire en sorte d'ajouter une option au scripte et à l'application pour pouvoir fournir un fichier txt, latex ou word, puis transformer ceci en fichier text (possible avec libreoffice via une commande pour les fichier word, et avec https://github.com/pkubowicz/opendetex pour les fichiers latex)
*bug : quand la transcription échoue, il arrive souvent que ce ne soit pas actualisé dans la base de donnée. La transcription continue d'être mraquée "on going"
*bug : quand un groupe possède une transcription avec une vidéo ayant pour titre abc (par exemple), si elle utiliser une autre vidéo nommée abc, le script échouera. Il faudrait donc vérifier qu'il n’existe pas déjà un fichier avec ce nom avant de l'ajouter, ou bien renommer les vidéos lorsqu'elles sont envoyées au serveur.

=== Comment installer le serveur ===

Tout d'abord il faut installer nodejs (https://nodejs.org/en/download/package-manager/) , npm (qui est compris avec nodejs), et mongoDB (https://docs.mongodb.com/manual/administration/install-on-linux/). Il faut ensuite cloner le repository disponible sur github : https://github.com/BurnSaibot/fananfPOC.git. Se placer dans le répertoire où se trouve l'application, et exécuter 
  npm install
qui va installer toutes les dépendances nécessaire au fonctionnement de l'application.

=== Architecture ===

L'application a été conçue en suivant le modèle MVC que j'avais appris à l'iut.
==== fananfPOC ====
===== config =====
Il s'agit de l'emplacement des fichiers de configuration, j'en avais besoin puisque je travaillais sur deux machines, et que je n'avais pas la même architecture sur les deux machines.

===== Controllers =====
Il s'agit du répertoire comportant les contrôleurs associés à mes modèles. On y trouve toutes les fonction utiles pour modifier les données pour tel ou tel modèle. Le fichier utils comporte des fonctions utilisées dans chacun des autres contrôleurs.

===== Models =====
Il s'agit du répertoire où sont disposé les fichiers de modèles nécessaires à l'application

===== node_modules =====
Il s'agit du répertoire comportant toutes les dépendances, il sera créer après avoir exécuter npm install

===== Scripts =====
Il s'agit du répertoire où l'ont peut accéder aux différents scripts bash et python nécessaires pour réaliser la transcription automatique d'une vidéo, qui sont appelés dans Controlers/Transcription.js 

===== Stylesheet =====
J'ai réaliser des fichiers css simple pour voir comment les lier avec l'application, mais la méthode employée ne semble pas fonctionner

===== tests =====
Je voulais écrire des tests et réaliser l'application en suivant la méthode du tdd... Mais J'ai rapidement abandonné l'idée. Les tests sont écrits pour fonction avec jasmine-node

===== views =====
Contient les différents templates ejs qui seront utilisés pour générer des pages html

===== package.json =====
Fichier json comportant la liste de toutes les dépendances nécessaire au bon fonctionnement de l'application. Utilisé lors de l'exécution de la commande npm install

===== package-lock.json =====
Fichier json comportant la liste de toutes les dépendances induites par les dépendances citées dans package.json. Aussi utilisé lros de l’exécution de la commande npm install

===== .gitignore =====
Permet d'ignorer le dossier node_modules lrosqu'on se sert de git. Upload les dépendances sur le git semblait superflu, surtout avec la facilité d'installation obtenue avec npm

===== Readme =====
Documentation

===== app.js =====
C'est le fichier principal de l'appication, celui qui est exécuté à la base. Il met en place tous les middlewares et 

===== route.js =====
Appelé par app.js, il liste les différentes routes et quel contrôleur appeler en fonction de de l'emplacement de l'utilisateur sur le site.

=== Comment démarrer le serveur ===

On m'a demandé de créer un compte sur la machine virtuelle qui aurait les droits pour lancer l'application. J'ai aussi donné les droits au compte de Mme Maynard directement. Mme Maynard a les informations nécessaire pour ce loger au compte. Les droits sont partagés via un groupe : webapplauncher.

Une fois connecté, il faut se placer dans le répertoire /srv/fananfPOC/ puis exécuter 
  nodejs app.js production
ou bien exécuter depuis n'importe quel répertoir
  nodejs /srv/fananfPOC/app.js production
Il y a une autre fichier de config utilisé lorsque je développait sur ma machine perso, car j'utilisait une bdd en ligne et n'utilisait pas la même architecture pour stocker les fichiers.

Une fois la commande exécutée, le serveur devrait se lancer et vous devriez voir afficher dans la console " Server launched & listening on port 3000"

Pour accéder à l'application depuis un navigateur, l'url est http://vmfananf:3000/

=== Explication du contenu de chaque page et de l'utilisation du site===

*S'enregistrer :
 S'enregistrer -> remplir le formulaire (mdp de taille 8 minimum) -> Valider.
*Se connecter : 
 Se connecter -> remplir le formulaire -> valider (normalement la bar de menu change !).
*Se déconnecter :
 Une fois connecté, l'utilisateur doit cliquer sur se déconnecter, qui se trouve en bas du menu.
*Consulter les transcription auxquelles on a accès :
 Une fois connecté, cliquer sur mes transcriptions.
*Créer une nouvelle transcription
 Une fois connecté, cliquer sur nouvelle transcription.
 Choisir le groupe auquel sera affecté la transcription.
 Choisir le format voulu.
 Choisir le fichier à traiter.
 Valider.
 Retour à l'accueil.
*Consulter les sous-titres disponibles pour une transcription :
 Une fois connecté, cliquer sur mes transcriptions.
 Choisir la transcription voulue, puis cliquer sur le lien consulter qui suit la transcription.
*Consulter un fichier de sous-titres : 
 Une fois connecté, cliquer sur mes transcriptions.
 Choisir la transcription voulue, puis cliquer sur le lien consulter qui suit la transcription.
 Cliquer sur le lien consulter qui suit le fichier de sous-titre voulu
*Éditer un fichier de sous-titres : 
 Une fois connecté, cliquer sur mes transcriptions.
 Choisir la transcription voulue, puis cliquer sur le lien consulter qui suit la transcription.
 Cliquer sur le lien éditer qui suit le fichier de sous-titre voulu
*Voir la liste des groupes dont je fais parti
 Une fois connecté, cliquer sur mes groupes.
*Consulter la liste de tous les utilisateurs
 Une fois connecté, cliquer sur les les utilisateurs.
*Consulter la fiche utilisateur de quelqu'un
 Une fois connecté, cliquer sur les les utilisateurs.
 Cliquer sur "Plus d'infos"
*Consulter sa propre fiche utilisateur
 Une fois connecté, cliquer sur ma fiche utilisateur.
