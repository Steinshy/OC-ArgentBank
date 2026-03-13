# Argent Bank - Tableau de Bord Financier

Une application de tableau de bord financier moderne construite avec React, Redux et Express.js.

![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple)
![Vite](https://img.shields.io/badge/Vite-7.3-green)
![Licence](https://img.shields.io/badge/Licence-MIT-green)

## 📋 Table des matières

- [Présentation](#présentation)
- [Caractéristiques](#caractéristiques)
- [Pile technologique](#pile-technologique)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Documentation API](#documentation-api)
- [Développement](#développement)
- [Tests](#tests)
- [Contribution](#contribution)
- [Licence](#licence)

## 🎯 Présentation

Argent Bank est une application web complète fournissant un tableau de bord financier permettant aux utilisateurs d'accéder de manière sécurisée à leurs comptes bancaires, transactions et informations de profil. Construite avec les dernières technologies, elle met l'accent sur la sécurité, la performance et l'expérience utilisateur.

## ✨ Caractéristiques

- 🔐 **Authentification sécurisée** - Connexion basée sur JWT avec persistance de token
- 👤 **Profils utilisateur** - Afficher et gérer les informations utilisateur
- 💳 **Gestion des comptes** - Surveiller plusieurs comptes bancaires
- 📊 **Historique des transactions** - Consulter les détails des transactions
- 🎨 **Design réactif** - Fonctionne parfaitement sur desktop et mobile
- ⚡ **Haute performance** - Construit avec Vite pour des mises à jour instantanées
- 📱 **Progressive Web App** - Installable et fonctionne hors ligne
- 🔒 **Routes protégées** - Pages nécessitant une authentification

## 🛠️ Pile technologique

### Frontend
- **Framework:** React 19 avec TypeScript
- **Outil de build:** Vite 7.3
- **Gestion d'état:** Redux Toolkit
- **Routage:** React Router v7
- **Client HTTP:** Fetch API
- **Icônes UI:** Lucide React
- **Qualité du code:** ESLint, Prettier, StyleLint

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Base de données:** MongoDB
- **Authentification:** JWT (JSON Web Tokens)
- **Hash de mot de passe:** bcrypt
- **Documentation:** Swagger/OpenAPI

## 📦 Prérequis

- **Node.js:** v16.0.0 ou supérieur
- **npm:** v8.0.0 ou supérieur
- **MongoDB:** v5.0 ou supérieur (pour le backend)

## 🚀 Installation

### Configuration Frontend

```bash
# Cloner le référentiel
git clone https://github.com/steinshy/ArgentBank.git
cd ArgentBank

# Installer les dépendances
npm install

# Créer un fichier d'environnement
cp .env.example .env.local

# Éditer .env.local et définir API_BASE_URL si nécessaire
# VITE_API_BASE_URL=http://localhost:3001
```

### Configuration Backend

```bash
# Naviguer vers le répertoire backend
cd Backend

# Installer les dépendances
npm install

# Créer un fichier d'environnement
cp .env.example .env

# Éditer .env avec votre configuration
# DATABASE_URL=mongodb://localhost/argentBankDB
# JWT_SECRET=votre_clé_secrète_ici

# Démarrer le serveur
npm run dev:server
```

## 🎮 Utilisation

### Démarrer le serveur de développement

```bash
# Frontend (depuis la racine du projet)
npm run dev
# Ouvre sur http://localhost:5173

# Backend (depuis le répertoire Backend)
npm run dev:server
# Exécute sur http://localhost:3001
```

### Construire pour la production

```bash
# Frontend
npm run build

# Aperçu de la version production localement
npm run preview
```

### Linting et formatage

```bash
npm run lint          # Vérifier la qualité du code
npm run lint:fix      # Corriger automatiquement les erreurs
npm run format        # Formater le code avec Prettier
npm run format:check  # Vérifier le formatage
```

## 📁 Structure du projet

```
ArgentBank/
├── Frontend
│   ├── src/
│   │   ├── pages/              # Composants de page
│   │   ├── components/         # Composants réutilisables
│   │   ├── features/           # Slices Redux
│   │   ├── services/           # Clients API
│   │   ├── store/              # Configuration Redux
│   │   ├── types/              # Types TypeScript
│   │   ├── App.tsx             # Composant racine
│   │   └── main.tsx            # Point d'entrée
│   ├── public/                 # Ressources statiques
│   ├── vite.config.ts          # Configuration Vite
│   └── package.json
│
├── Backend/
│   ├── controllers/            # Gestionnaires de requête
│   ├── routes/                 # Routes API
│   ├── middleware/             # Middleware Express
│   ├── services/               # Logique métier
│   ├── database/               # Schémas MongoDB
│   ├── server.js               # Point d'entrée serveur
│   ├── swagger.yaml            # Documentation API
│   └── package.json
│
├── README.md                   # Documentation anglaise
├── README.fr.md                # Documentation française
└── .env.example                # Modèle d'environnement
```

## 📚 Documentation API

La documentation API du backend est disponible via Swagger à:
```
http://localhost:3001/api-docs
```

### Points de terminaison principaux

- `POST /api/v1/user/login` - Connexion utilisateur
- `GET /api/v1/user/profile` - Obtenir le profil utilisateur
- `PUT /api/v1/user/profile` - Mettre à jour le profil utilisateur
- `GET /api/v1/user/accounts` - Lister les comptes utilisateur
- `GET /api/v1/user/accounts/:id/transactions` - Obtenir les transactions du compte

## 💻 Développement

### Style de code

Ce projet suit des normes strictes de qualité de code:

- **ESLint:** Impose des modèles de code cohérents
- **Prettier:** Formate automatiquement le code à la sauvegarde
- **TypeScript:** Vérification de type stricte activée
- **StyleLint:** Validation CSS/SCSS

### Ajouter des fonctionnalités

1. Créer un nouveau composant de page dans `src/pages/`
2. Ajouter la configuration de route dans `src/AppRoutes.tsx`
3. Créer un slice Redux si la gestion d'état est nécessaire dans `src/features/`
4. Ajouter les appels API à `src/services/`
5. Définir les types dans `src/types/index.ts`

### Flux Git

```bash
# Créer une branche de fonctionnalité
git checkout -b feature/nom-de-la-fonction

# Faire des changements et les valider
git add .
git commit -m "feat: description des changements"

# Pousser et créer une pull request
git push origin feature/nom-de-la-fonction
```

## 🧪 Tests

### Tests manuels

```bash
# Démarrer le serveur de développement
npm run dev

# Ouvrir le navigateur et tester:
# 1. Navigation de la page d'accueil
# 2. Fonctionnalité de connexion
# 3. Accès au profil (route protégée)
# 4. Navigation entre les pages
```

### Tests de linting

```bash
npm run lint        # Vérifier les problèmes
npm run format:check # Vérifier le formatage
```

## 🤝 Contribution

Les contributions sont bienvenues! Veuillez suivre ces étapes:

1. Forker le référentiel
2. Créer une branche de fonctionnalité (`git checkout -b feature/amazing-feature`)
3. Valider vos changements (`git commit -m 'feat: add amazing feature'`)
4. Pousser vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

## 👤 Auteur

- **Nom:** steinshy
- **Email:** votre.email@example.com
- **GitHub:** [@steinshy](https://github.com/steinshy)

## 📞 Support

Pour toute assistance, envoyez un email à votre-email@example.com ou ouvrez une issue sur GitHub.

## 🔗 Liens

- [Référentiel](https://github.com/steinshy/ArgentBank)
- [Issues](https://github.com/steinshy/ArgentBank/issues)
- [Documentation anglaise](./README.md)

---

**Dernière mise à jour:** Mars 2024
