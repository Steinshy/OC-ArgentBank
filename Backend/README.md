# Argent Bank API - Backend

A RESTful API for Argent Bank financial dashboard, built with Node.js, Express, and MongoDB.

![Node.js](https://img.shields.io/badge/Node.js-14%2B-green)
![Express](https://img.shields.io/badge/Express-4.17-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-5.0%2B-green)
![JWT](https://img.shields.io/badge/JWT-9.0-orange)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Development](#development)
- [Contributing](#contributing)

## 🎯 Overview

The Argent Bank API provides secure authentication and user management services for the Argent Bank financial dashboard. Built with Express.js and MongoDB, it features JWT-based authentication, RESTful endpoints, and comprehensive API documentation via Swagger.

## ✨ Features

- 🔐 **JWT Authentication** - Secure token-based authentication
- 👤 **User Management** - Create, read, and update user profiles
- 🔒 **Password Hashing** - bcrypt encryption for secure password storage
- 📝 **API Documentation** - Interactive Swagger UI at `/api-docs`
- 🌐 **CORS Support** - Configurable cross-origin resource sharing
- 🗄️ **MongoDB Integration** - NoSQL database with mongoose ODM
- 🔄 **Auto-Reload** - Nodemon for development hot-reloading

## 🛠️ Tech Stack

- **Runtime:** Node.js (v14+)
- **Framework:** Express.js 4.17
- **Database:** MongoDB (v5.0+)
- **ODM:** Mongoose 5.9
- **Authentication:** JSON Web Tokens (JWT) 9.0
- **Password Security:** bcrypt 5.0
- **Documentation:** Swagger UI Express 4.1
- **YAML Parser:** yamljs 0.3
- **HTTP Client:** axios 0.19 (for scripts)
- **Dev Tools:** nodemon 2.0

## 📦 Prerequisites

Before running the API, ensure you have the following installed:

- **Node.js:** v14.0.0 or higher
- **npm:** v6.0.0 or higher
- **MongoDB:** v5.0 or higher (running locally or remote connection)

Verify your installations:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB version (if running locally)
mongo --version
# or for newer MongoDB versions
mongosh --version
```

## 🚀 Installation

```bash
# Navigate to backend directory
cd Backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Edit .env with your configuration (see Environment Variables section)
```

## 🎮 Usage

### Start Development Server

```bash
# Start with auto-reload (recommended for development)
npm run dev:server

# Or start without auto-reload
npm run server
```

The API will be available at **http://localhost:3001**

### Populate Database with Test Users

```bash
# Run database population script
npm run populate-db
```

This creates two test users:

| User             | Email              | Password      |
| ---------------- | ------------------ | ------------- |
| **Tony Stark**   | `tony@stark.com`   | `password123` |
| **Steve Rogers** | `steve@rogers.com` | `password456` |

### Verify API is Running

```bash
# Test root endpoint
curl http://localhost:3001

# Or open in browser
open http://localhost:3001
```

## 📁 Project Structure

```
Backend/
├── server.js                    # Express app entry point
├── package.json                 # Dependencies and scripts
├── .env                         # Environment configuration (not in git)
├── .env.example                 # Environment template
├── swagger.yaml                 # OpenAPI/Swagger documentation
├── controllers/                 # Request handlers
│   └── userController.js        # User CRUD operations
├── routes/                      # API route definitions
│   └── userRoutes.js            # User endpoints (/api/v1/user/*)
├── services/                    # Business logic layer
│   └── userService.js           # User authentication & data operations
├── middleware/                  # Express middleware
│   └── tokenValidation.js       # JWT token verification
├── database/                    # Database configuration
│   ├── connection.js            # MongoDB connection setup
│   └── models/
│       └── userModel.js         # User mongoose schema
└── scripts/                     # Utility scripts
    └── populateDatabase.js      # Seed test users
```

## 📚 API Documentation

### Swagger UI

Once the server is running, access interactive API documentation at:

```
http://localhost:3001/api-docs
```

### Available Endpoints

#### Authentication

| Method | Endpoint              | Description                 | Auth Required |
| ------ | --------------------- | --------------------------- | ------------- |
| `POST` | `/api/v1/user/signup` | Create new user account     | ❌            |
| `POST` | `/api/v1/user/login`  | Login and receive JWT token | ❌            |

#### User Profile

| Method | Endpoint               | Description         | Auth Required |
| ------ | ---------------------- | ------------------- | ------------- |
| `POST` | `/api/v1/user/profile` | Get user profile    | ✅            |
| `PUT`  | `/api/v1/user/profile` | Update user profile | ✅            |

### Example Requests

#### Login

```bash
curl -X POST http://localhost:3001/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "tony@stark.com",
    "password": "password123"
  }'
```

Response:

```json
{
  "status": 200,
  "message": "User successfully logged in",
  "body": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Profile

```bash
curl -X POST http://localhost:3001/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Update Profile

```bash
curl -X PUT http://localhost:3001/api/v1/user/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Anthony",
    "lastName": "Stark"
  }'
```

## 🔧 Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```bash
# Database Connection
DATABASE_URL=mongodb://localhost/argentBankDB

# JWT Configuration
SECRET_KEY=your_super_secret_jwt_key_change_in_production
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# Server Configuration
NODE_ENV=development
PORT=3001

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

**Security Notes:**

- Change `SECRET_KEY` and `JWT_SECRET` to strong random values in production
- Never commit `.env` file to version control
- Use `.env.example` as template

## 🗄️ Database

### MongoDB Setup

#### Local MongoDB

```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community@5.0

# Start MongoDB service
brew services start mongodb-community@5.0

# Verify connection
mongosh
```

#### Database Connection

The API connects to MongoDB using the `DATABASE_URL` environment variable. Default connection string:

```
mongodb://localhost/argentBankDB
```

### User Schema

Users are stored with the following schema:

```javascript
{
  email: String,       // Unique user email
  password: String,    // Hashed with bcrypt (12 rounds)
  firstName: String,   // User's first name
  lastName: String,    // User's last name
  createdAt: Date,     // Auto-generated
  updatedAt: Date      // Auto-generated
}
```

### Populate Test Data

```bash
# Run population script (creates 2 test users)
npm run populate-db
```

**Test Users:**

- Tony Stark: `tony@stark.com` / `password123`
- Steve Rogers: `steve@rogers.com` / `password456`

## 💻 Development

### Available Scripts

```bash
npm run dev:server    # Start with nodemon (auto-reload)
npm run server        # Start production server
npm run populate-db   # Seed database with test users
```

### Architecture Pattern

The API follows a layered architecture:

1. **Routes** (`routes/`) - Define endpoints and HTTP methods
2. **Controllers** (`controllers/`) - Handle requests/responses
3. **Services** (`services/`) - Implement business logic
4. **Models** (`database/models/`) - Define data schemas
5. **Middleware** (`middleware/`) - Authentication, validation, etc.

### Adding New Endpoints

1. **Create Route** - Define endpoint in `routes/`
2. **Create Controller** - Handle HTTP request/response in `controllers/`
3. **Create Service** - Implement business logic in `services/`
4. **Update Swagger** - Document endpoint in `swagger.yaml`
5. **Test** - Verify with Swagger UI or curl

### JWT Token Flow

1. User logs in via `/api/v1/user/login`
2. Server validates credentials and returns JWT token
3. Client includes token in `Authorization: Bearer <token>` header
4. `tokenValidation` middleware verifies token on protected routes
5. Token expires after 1 day (configurable in `userService.js`)

### CORS Configuration

CORS is enabled for all origins by default. To restrict to specific origins, modify `server.js`:

```javascript
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);
```
