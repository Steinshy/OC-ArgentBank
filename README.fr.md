<h1 align="center">Argent Bank</h1>

<p align="center"><strong>Langues :</strong> <a href="README.md">English</a> | <a href="README.fr.md">Français</a></p>

<p align="center">
  <a href="https://steinshy.github.io/OC-ArgentBank/"><strong>Démo en ligne →</strong></a>
</p>

<p align="center">
  <img src=".github/assets/mockup.png" alt="Maquette responsive Argent Bank" width="1024" />
</p>

SPA de tableau de bord bancaire réalisée pour le parcours front-end OpenClassrooms : connexion, gestion du profil, consultation des transactions.

## Démo en ligne

La démo fonctionne sans backend : une API simulée dans le navigateur (`src/api/mockApi.ts`) répond aux mêmes endpoints que le serveur Express.

| Email              | Mot de passe  |
| ------------------ | ------------- |
| `tony@stark.com`   | `password123` |
| `steve@rogers.com` | `password456` |

Les comptes créés et les modifications de profil sont conservés dans le `localStorage` du navigateur.

## Fonctionnalités

- Connexion, inscription et déconnexion, avec option « se souvenir de moi »
- Pages profil, paramètres et transactions protégées
- Modification du nom dans le profil
- Transactions par compte avec vue détaillée et édition de catégorie/notes (locale uniquement)

## Stack technique

| Domaine  | Stack                                                       |
| -------- | ----------------------------------------------------------- |
| Frontend | React 19, TypeScript, Vite 8, Redux Toolkit, React Router 8 |
| Backend  | Express 5, MongoDB (Mongoose), JWT, Swagger UI              |
| Outils   | Workspace pnpm, ESLint, Stylelint, Prettier                 |

## Démarrage

Nécessite Node.js 24 et pnpm (`corepack enable` utilise la version fixée dans `package.json`).

```bash
git clone https://github.com/Steinshy/OC-ArgentBank.git
cd OC-ArgentBank
pnpm install
```

### Frontend seul (API simulée)

```bash
VITE_USE_MOCK=true pnpm dev
```

### Stack complète

Nécessite Podman avec `podman compose` pour la base MongoDB locale.

```bash
cp Backend/.env.example Backend/.env   # définir JWT_SECRET
pnpm dev:all                           # MongoDB + API sur :3001 + utilisateurs de test + frontend sur :5173
podman compose down                    # arrêter MongoDB
```

Référence de l'API et Swagger UI : [Backend/README.md](./Backend/README.md).

## Configuration

| Variable            | Défaut                  | Rôle                                                       |
| ------------------- | ----------------------- | ---------------------------------------------------------- |
| `VITE_API_BASE_URL` | `http://localhost:3001` | URL du backend                                             |
| `VITE_USE_MOCK`     | non défini              | `true` sert les données depuis l'API simulée du navigateur |
| `VITE_BASE_PATH`    | `/`                     | Chemin de base si l'app est servie dans un sous-dossier    |

## Scripts

| Commande       | Rôle                                |
| -------------- | ----------------------------------- |
| `pnpm dev`     | Serveur de développement Vite       |
| `pnpm dev:all` | MongoDB + backend + seed + frontend |
| `pnpm build`   | Build de production dans `dist/`    |
| `pnpm preview` | Prévisualisation du build           |
| `pnpm lint`    | ESLint + Stylelint                  |
| `pnpm fix`     | ESLint --fix + Prettier --write     |
| `pnpm check`   | tsc + lint + Prettier --check       |

## Déploiement

Les deux cibles sont buildées en mode simulé : aucun backend n'est déployé.

- **GitHub Pages :** `.github/workflows/deploy.yml` builde et publie à chaque push sur `main`.
- **Coolify :** le `Dockerfile` builde l'app et la sert avec nginx.

## Documentation

- [ARCHITECTURE-FR.md](./ARCHITECTURE-FR.md) : décisions d'architecture
- [Backend/README.md](./Backend/README.md) : API, environnement et base de données
