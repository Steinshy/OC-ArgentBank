# E-mails Projet Argent Bank

## E-mail 1

**De :** Mila  
**A :** Moi  
**Objet :** Bienvenue !

Hello,

Nous avons notre nouveau projet ! Il concerne une nouvelle banque qui demarre, Argent Bank, qui essaie de percer dans le secteur et qui a besoin d'aide pour mettre en place son application.

Nous avons obtenu un contrat en deux parties qui se decompose en plusieurs phases :

- **Phase 1 : Authentification des utilisateurs** - Creation d'une application web permettant aux clients de se connecter et de gerer leurs comptes et leur profil.
- **Phase 2 : Transactions** - Il s'agirait de specifier les endpoints d'API necessaires pour une eventuelle deuxieme mission une fois que nous aurons termine la premiere.

A la fin du projet, tu presenteras les deux livrables a Avery Moreau, qui gere l'equipe technique d'Argent Bank.

Nous attendons encore des informations, mais je veillerai a ce que tu sois inclus dans toutes les communications pour que tu sois a jour sur le projet.

Au plaisir de travailler avec toi !

Mila, Cheffe de projet

---

## E-mail 2

**De :** Avery  
**A :** Moi, Mila  
**Objet :** Brief mission profil Argent Bank

Bonjour Mila et l'equipe,

Je suis Avery Moreau VP Engineering chez Argent Bank.

Nous sommes ravis de vous avoir avec nous pour creer notre application web React pour le nouveau systeme d'authentification des utilisateurs.

Nous avons des delais tres serres et nous aurons besoin d'aide !

Voici un apercu de ce dont nous avons besoin pour la **phase 1 : Authentification des utilisateurs**.

- Creer l'application web complete et responsive avec React. Comme point de depart, nous vous avons fourni le HTML statique et le CSS pour la page d'accueil, la page de connexion et la page de profil.
- Utiliser Redux pour gerer le state de l'ensemble de l'application.
- Ce que doit faire l'application (voir les details pour chacune sur nos modeles de GitHub Issues) :
  - L'utilisateur peut visiter la page d'accueil.
  - L'utilisateur peut se connecter au systeme.
  - L'utilisateur peut se deconnecter du systeme.
  - L'utilisateur ne peut voir les informations relatives a son propre profil qu'apres s'etre connecte avec succes.
  - L'utilisateur peut modifier le profil et conserver les donnees dans la base de donnees.

Vous pouvez commencer par forker notre repo existant et suivre l'avancement du travail grace aux modeles d'Issues GitHub que nous y avons incluses.

// que le swaggers
Pour la **phase 2 : Transactions**, nous sommes encore en phase de conception. De notre cote, nous mettons au point une fonctionnalite pour les transactions qui doit pouvoir permettre aux utilisateurs :

- de visualiser toutes leurs transactions pour le mois en cours, groupees par compte ;
- de visualiser les details d'une transaction dans une autre vue ;
- d'ajouter, de modifier ou de supprimer des informations sur une transaction.

Puisque vous gerez deja l'application web pour la phase 1, nous voulons connaitre votre avis sur la facon dont vous pensez que les API devraient etre modelisees du cote back-end. Nous avons besoin que vous nous fournissiez un document decrivant les API proposees pour les transactions, en suivant les directives de Swagger.

Parmi les elements cles a specifier pour chaque endpoint de l'API, il faudra :

- la methode HTTP (ex. : GET, POST, etc.) ;
- la route (ex. : `/store/inventory`) ;
- la description de ce a quoi correspond l'endpoint (ex. : retour de l'inventaire des animaux de compagnie) ;
- les parametres possibles pour tenir compte des differents scenarios (ex. : `itemId` facultatif) ;
- les differentes reponses avec les codes de reponse correspondants qui ont un sens pour cet endpoint (ex. : `404` pour une erreur d'article inconnu).

Vous pouvez utiliser la page des transactions presentee dans les maquettes pour guider vos choix (mais vous n'avez pas besoin d'implementer cette page). Assurez-vous simplement que le document est exporte vers un fichier YAML (`Fichier > Enregistrer sous YAML`) en utilisant la syntaxe Swagger, qui peut etre exportee dans l'outil d'edition de Swagger.

Nous ferons une revue de code et discuterons ensemble de la proposition d'API une fois que tout sera termine.

Au plaisir de travailler avec vous !

Avery Moreau
