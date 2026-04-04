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
```

### Backend Setup

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

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

## 📚 API Documentation

The backend API documentation is available via Swagger at:

```
http://localhost:3001/api-docs
```

### Testing with HTTPie

For command-line API testing, see [Backend/API_TESTING.md](./Backend/API_TESTING.md) for complete HTTPie examples.

Quick test:

```bash
# Source helper functions
source Backend/httpie-examples.sh

# Login and save token
TOKEN=$(ab_login "tony@stark.com" "password123" | jq -r '.body.token')

# Get profile
ab_profile "$TOKEN"
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

````

## 🧪 Testing

### HTTPie Desktop - API Testing

You can test the API using HTTPie Desktop:

1. **Import Collection**: Open HTTPie Desktop → **+** → **Import** → Select `Backend/argent-bank-postman-collection.json`
2. **Start Backend**: `cd Backend && npm run dev:server`
3. **Login**: Expand "Authentication" folder → Run "Login - Tony Stark" (token auto-saves)
4. **Test**: Try other requests like "Get User Profile", "Get All Accounts"

See [Backend/HTTPIE_DESKTOP.md](./Backend/HTTPIE_DESKTOP.md) for complete guide.

### Test Credentials

To test the application, use these test user accounts:

| Email              | Password      | Name         |
| ------------------ | ------------- | ------------ |
| `tony@stark.com`   | `password123` | Tony Stark   |
| `steve@rogers.com` | `password456` | Steve Rogers |

To populate the database with test users:

```bash
# Navigate to backend directory
cd Backend

# Run the populate script
npm run populate-db
````

### Manual Testing

```bash
# Start backend server
cd Backend
npm run dev:server

# In another terminal, start frontend dev server
npm run dev

# Open browser and test:
# 1. Home page navigation
# 2. Login with test credentials above
# 3. Profile access (protected route)
# 4. Navigation between pages
# 5. Transaction history
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

## 🔗 Links

- [Repository](https://github.com/steinshy/ArgentBank)
- [Issues](https://github.com/steinshy/ArgentBank/issues)
- [French Documentation](./README.fr.md)

---

https://redux-toolkit.js.org/rtk-query/usage/automated-refetching
