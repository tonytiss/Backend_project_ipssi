# Projet Éducatif Backend Express.js

## Description

Ce projet est un backend développé dans le cadre d’un projet éducatif. Il utilise **Express.js** comme framework Node.js pour construire une API REST. La base de données est gérée avec **PostgreSQL**.

Il s'agit d'une **application de type bloc-notes** permettant à des utilisateurs de **créer un compte, se connecter et stocker leurs notes de façon sécurisée**. L'accès aux données est protégé par un système d'authentification avec token et les mots de passe sont hashés via **argon2id**.

La communication entre le backend et la base de données est chiffrée grâce à une connexion **SSL**.

## Fonctionnalités principales

### Gestion des utilisateurs

- **Créer un utilisateur** (`POST /users/`)  
  Création avec validation email et mot de passe.
- **Supprimer un utilisateur** (`DELETE /users/:id`)  
  Suppression sécurisée, nécessite authentification.
- **Se connecter** (`POST /users/login`)  
  Authentification avec limitation de tentative par email.
- **Obtenir ses informations** (`GET /users/me`)  
  Récupération des données de l’utilisateur connecté.
- **Lister tous les utilisateurs** (`GET /users/index`)  
  Accessible uniquement aux administrateurs.
- **Mettre à jour un utilisateur** (`PATCH /users/:id`)  
  Modification des données, avec validation et authentification.
- **Promouvoir un utilisateur en admin** (`PATCH /users/promoteadmin/:id`)  
  Élévation de rôle.

### Gestion des notes

- **Créer une note** (`POST /notes/`)  
  Création de note sécurisée avec validation de contenu.
- **Obtenir les notes d’un utilisateur** (`GET /notes/:email`)  
  Récupération des notes d’un utilisateur spécifique.
- **Supprimer une note** (`DELETE /notes/:id`)  
  Suppression sécurisée d’une note.
- **Lister toutes les notes groupées par utilisateur** (`GET /notes/`)  
  Accessible uniquement aux administrateurs.

## Technologies utilisées

- **Node.js** avec **Express.js**  
- **PostgreSQL** pour la gestion des données  
- **argon2id** pour le hashage sécurisé des mots de passe  
- Connexion sécurisée avec **SSL** entre le backend et la base de données  

## Middlewares d'authentification et d’autorisation

Le projet utilise plusieurs middlewares personnalisés pour gérer la sécurité des routes via des **tokens JWT** et les rôles des utilisateurs :

- **checkIfTokenExists**  
  Ce middleware vérifie que la requête HTTP contient un header `Authorization` avec un token JWT valide.  
  - Si le header est absent, la requête est rejetée avec un statut **401 Unauthorized**.  
  - Si le token est manquant dans le header, la requête est également rejetée.

- **decodeToken**  
  Ce middleware décode et vérifie la validité du token JWT grâce à la clé secrète définie dans les variables d’environnement (`JWT_SECRET`).  
  - Si le token est invalide ou expiré, la requête est rejetée avec un statut **401 Unauthorized** et un message invitant l’utilisateur à se reconnecter.  
  - En cas de succès, les informations décodées du token sont ajoutées à l’objet `req` (`req.decodedToken`) pour être utilisées dans les contrôleurs.

- **checkAdmin**  
  Ce middleware contrôle que l’utilisateur connecté possède le rôle **admin** avant d’accéder à certaines routes.  
  - Si le rôle n’est pas `admin`, la requête est rejetée avec un statut **403 Forbidden** et un message d’accès refusé.  
  - Sinon, la requête peut continuer.

Ces middlewares sont appliqués sur les routes nécessitant une authentification et/ou une autorisation spécifique pour protéger l’accès aux données sensibles et garantir la sécurité des échanges.

Le projet utilise **express-validator** pour valider et assainir les données reçues dans les requêtes HTTP. Les middlewares de validation permettent de garantir que les données envoyées par le client respectent les règles attendues avant d’être traitées par les contrôleurs.

Voici les validations principales implémentées :

- **password**  
  - Obligatoire lors de la création d’un utilisateur et lors de la mise à jour si le mot de passe est modifié.  
  - Doit contenir au moins 12 caractères, incluant au moins une majuscule, une minuscule, un chiffre et un symbole.  
  - Non vide si présent.
  - Optionnel lors du login (le mot de passe est alors simplement vérifié, sans modification).

- **email**  
  - Pour la connexion : le champ email ne doit pas être vide.

- **emailcreate**  
  - Pour la création et mise à jour utilisateur.  
  - Doit exister, ne pas être vide et être un email valide.

- **noteTitle**  
  - Le titre de la note est obligatoire.  
  - Longueur maximale : 50 caractères.

- **noteContent**  
  - Le contenu de la note est obligatoire.  
  - Longueur maximale : 1000 caractères.

- **validationResult**  
  - Middleware final qui récupère les erreurs éventuelles générées par les validations précédentes.  
  - En cas d’erreur, renvoie un statut 400 avec le premier message d’erreur.  
  - Sinon, passe la main au middleware suivant.

Ces middlewares sont utilisés dans les routes pour s’assurer que les données reçues sont conformes aux attentes et éviter ainsi les erreurs ou failles potentielles.

 - **loginLimiterByEmail**
   
   - limite le nombre de tentatives de connexion pour chaque adresse email. Il applique une stratégie de **rate limiting** personnalisée basée sur les règles suivantes :
     - Maximum **5 tentatives** autorisées sur une fenêtre glissante de **15 minutes**.
     - Si la limite est dépassée, l'utilisateur reçoit un message lui indiquant le temps d'attente avant de réessayer.
     - Les tentatives sont suivies en mémoire via une `Map` associant chaque adresse email à ses tentatives récentes.

Ce mécanisme permet de **réduire les risques d’attaques par force brute** ciblant les mots de passe utilisateur lors du login.
## Concernant la base de données

###  Caractéristiques du SGBD utilisé

Le projet utilise **PostgreSQL**, un système de gestion de base de données relationnelle (SGBDR) puissant, open source, réputé pour sa robustesse, sa conformité aux standards SQL, et ses nombreuses fonctionnalités avancées. PostgreSQL offre notamment :

- Gestion avancée des types de données.
- Support complet des transactions ACID.
- Sécurité via des mécanismes d’authentification, de chiffrement et de contrôle d’accès.
- Extensibilité et optimisation pour des performances élevées.

Ces caractéristiques en font un choix adapté pour une application backend nécessitant fiabilité, intégrité et sécurité.

---

## Tables et champs créés

### Table `Users`

- **id** (clé primaire, auto-incrémentée) : identifiant unique de chaque utilisateur (géré automatiquement par Sequelize).
- **firstName** : prénom de l'utilisateur, champ obligatoire.
- **lastName** : nom de famille de l'utilisateur, champ obligatoire.
- **email** : adresse email unique, utilisée pour l’authentification, champ obligatoire.
- **password** : mot de passe stocké sous forme hashée avec `argon2id` (hachage automatique via hook Sequelize), champ obligatoire.
- **role** : rôle de l’utilisateur, de type ENUM avec valeurs possibles `"user"` ou `"admin"`, valeur par défaut `"user"`, permet la gestion des droits d’accès différenciés.
- **createdAt** : horodatage automatique indiquant la date et l’heure de création de l’enregistrement.
- **updatedAt** : horodatage automatique indiquant la date et l’heure de la dernière mise à jour de l’enregistrement.

Cette structure permet de gérer efficacement les utilisateurs, avec une sécurisation des mots de passe assurée avant sauvegarde, et un suivi automatique des dates de création et modification.
---

### Table `Notes`

- **id** (clé primaire, auto-incrémentée) : identifiant unique de chaque note.
- **titre** : titre de la note, limité à 50 caractères, champ obligatoire.
- **contenu** : contenu textuel de la note, limité à 1000 caractères, champ obligatoire.
- **userId** (clé étrangère) : référence à l’identifiant de l’utilisateur propriétaire dans la table `Users`. Cette association garantit la liaison entre chaque note et son auteur. La suppression d’un utilisateur entraîne la suppression en cascade de ses notes (`onDelete: CASCADE`).

Cette architecture simple assure la cohérence et la facilité de manipulation des notes en relation avec leurs utilisateurs.


---

###  Configuration et gestion des certifications (SSL/TLS)

La communication entre le backend Express.js et la base de données PostgreSQL est sécurisée via une connexion **SSL/TLS**. Cela permet de chiffrer les échanges pour protéger les données sensibles (mots de passe, notes) contre l’interception et les attaques de type « man-in-the-middle ».

- Le serveur PostgreSQL est configuré avec un certificat SSL valide (auto-signé ou fourni par une autorité de certification).
- Le client (backend) se connecte en mode SSL avec vérification du certificat.
- Les variables d’environnement spécifient les chemins des clés et certificats nécessaires.

Cette sécurisation est cruciale pour assurer la confidentialité et l’intégrité des données lors des communications.

---


## Installation

```bash
# Cloner le dépôt
git clone <url-du-repo>

# Installer les dépendances
npm install

# Configurer la base PostgreSQL avec SSL activé

# Définir les variables d’environnement nécessaires (connexion à la BDD, clés SSL, etc.)

# Lancer le serveur
npm start
```
---

## Axes d'améliorations

### Confidentialité

- Ajouter un chiffrement des données sensibles au niveau de la base (chiffrement au repos).
- Mise en place de politiques d’accès plus granulaires avec PostgreSQL (rôles, permissions).
- Utilisation de clé asymétrique pour les tokens JWT :
  - Si des clients tiers doivent consommer les tokens.
  - Si des services externes doivent pouvoir vérifier les tokens sans pouvoir en émettre.
  - Si on souhaite séparer les responsabilités (authentification vs. validation).
- Rotation des tokens avec un refresh token.
- Associer le token à des informations d'identification supplémentaires (ex: adresse IP, User-Agent).
- Limiter les connexions par adresse IP et email pour réduire les risques de brute-force ou d'abus (via middleware ou base de données en multi-instance).

### Intégrité

- Mettre en place des audits de données pour tracer les modifications importantes (logs, historique des modifications).

### Disponibilité

- Configurer une réplication en haute disponibilité (`master-slave`, clustering PostgreSQL).
- Mettre en place des sauvegardes automatiques régulières ainsi que des procédures de restauration rapides.
- Surveiller la base de données pour anticiper les problèmes de charge, de connexion ou de stockage.
