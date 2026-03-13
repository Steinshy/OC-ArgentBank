# Argent Bank - Financial Dashboard

A modern financial dashboard application built with React, Redux, and Express.js.

![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Redux](https://img.shields.io/badge/Redux-Toolkit-purple)
![Vite](https://img.shields.io/badge/Vite-7.3-green)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

Argent Bank is a full-stack financial dashboard providing users with secure access to their bank accounts, transactions, and profile management. Built with cutting-edge technologies, it emphasizes security, performance, and user experience.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login with token persistence
- 👤 **User Profiles** - View and manage user information
- 💳 **Account Management** - Monitor multiple accounts
- 📊 **Transaction History** - View detailed transaction records
- 🎨 **Responsive Design** - Works seamlessly on desktop and mobile
- ⚡ **High Performance** - Built with Vite for instant dev updates
- 📱 **Progressive Web App** - Installable and works offline
- 🔒 **Protected Routes** - Authentication-required pages

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7.3
- **State Management:** Redux Toolkit
- **Routing:** React Router v7
- **HTTP Client:** Fetch API
- **UI Icons:** Lucide React
- **Code Quality:** ESLint, Prettier, StyleLint

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcrypt
- **Documentation:** Swagger/OpenAPI

## 📦 Prerequisites

- **Node.js:** v16.0.0 or higher
- **npm:** v8.0.0 or higher
- **MongoDB:** v5.0 or higher (for backend)

## 🚀 Installation

### Frontend Setup

```bash
# Clone the repository
git clone https://github.com/steinshy/ArgentBank.git
cd ArgentBank

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit .env.local and set API_BASE_URL if needed
# VITE_API_BASE_URL=http://localhost:3001
```

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your configuration
# DATABASE_URL=mongodb://localhost/argentBankDB
# JWT_SECRET=your_secret_key_here

# Start the server
npm run dev:server
```

## 🎮 Usage

### Start Development Server

```bash
# Frontend (from project root)
npm run dev
# Opens at http://localhost:5173

# Backend (from Backend directory)
npm run dev:server
# Runs at http://localhost:3001
```

### Build for Production

```bash
# Frontend
npm run build

# Preview production build locally
npm run preview
```

### Linting and Formatting

```bash
npm run lint          # Check code quality
npm run lint:fix      # Auto-fix lint errors
npm run format        # Format code with Prettier
npm run format:check  # Check formatting
```

## 📁 Project Structure

```
ArgentBank/
├── Frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   ├── components/         # Reusable components
│   │   ├── features/           # Redux feature slices
│   │   ├── services/           # API clients
│   │   ├── store/              # Redux configuration
│   │   ├── types/              # TypeScript types
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # Entry point
│   ├── public/                 # Static assets
│   ├── vite.config.ts          # Vite configuration
│   └── package.json
│
├── Backend/
│   ├── controllers/            # Request handlers
│   ├── routes/                 # API routes
│   ├── middleware/             # Express middleware
│   ├── services/               # Business logic
│   ├── database/               # MongoDB schemas
│   ├── server.js               # Server entry point
│   ├── swagger.yaml            # API documentation
│   └── package.json
│
├── README.md                   # This file (English)
├── README.fr.md                # Documentation (French)
└── .env.example                # Environment template
```

## 📚 API Documentation

The backend API documentation is available via Swagger at:
```
http://localhost:3001/api-docs
```

### Main Endpoints

- `POST /api/v1/user/login` - User login
- `GET /api/v1/user/profile` - Get user profile
- `PUT /api/v1/user/profile` - Update user profile
- `GET /api/v1/user/accounts` - List user accounts
- `GET /api/v1/user/accounts/:id/transactions` - Get account transactions

## 💻 Development

### Code Style

This project follows strict code quality standards:

- **ESLint:** Enforces consistent code patterns
- **Prettier:** Auto-formats code on save
- **TypeScript:** Strict type checking enabled
- **StyleLint:** CSS/SCSS validation

### Adding Features

1. Create a new page component in `src/pages/`
2. Add route configuration in `src/AppRoutes.tsx`
3. Create Redux slice if state management needed in `src/features/`
4. Add API calls to `src/services/`
5. Define types in `src/types/index.ts`

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push and create pull request
git push origin feature/feature-name
```

## 🧪 Testing

### Manual Testing

```bash
# Start dev server
npm run dev

# Open browser and test:
# 1. Home page navigation
# 2. Login functionality
# 3. Profile access (protected route)
# 4. Navigation between pages
```

### Linting Tests

```bash
npm run lint        # Check for issues
npm run format:check # Verify formatting
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

## 👤 Author

- **Name:** steinshy
- **Email:** your.email@example.com
- **GitHub:** [@steinshy](https://github.com/steinshy)

## 📞 Support

For support, email your-email@example.com or open an issue on GitHub.

## 🔗 Links

- [Repository](https://github.com/steinshy/ArgentBank)
- [Issues](https://github.com/steinshy/ArgentBank/issues)
- [French Documentation](./README.fr.md)

---

**Last Updated:** March 2024
