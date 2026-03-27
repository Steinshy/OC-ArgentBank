# Argent Bank - Project TODO

**Project Status:** Phase 1 (User Authentication) - In Progress
**Last Updated:** March 27, 2026

---

## 📋 Project Overview

Two-phase project for Argent Bank financial dashboard:

- **Phase 1:** User authentication & profile management (Frontend + Backend integration)
- **Phase 2:** Transaction API specification (Swagger/OpenAPI)

---

## 📄 FILES TO CREATE

### Frontend Files

- [ ] `.env.local` - Frontend environment variables
  - Copy template: `cp .env.example .env.local` (if example exists)
  - Set: `VITE_API_BASE_URL=http://localhost:3001`

- [ ] `src/pages/Home/Home.html` - Home page HTML template
  - Reference template for styling consistency with other pages
  - Can be reference-only or deleted after styling complete

- [ ] `src/components/Layout/Header.tsx` - Reusable header component
  - Navigation bar with logo and nav links
  - User authentication links (Sign In / Profile / Sign Out)
  - Used by Layout.tsx wrapper

- [ ] `src/components/Layout/Footer.tsx` - Reusable footer component
  - Copyright information
  - Footer links (if needed)
  - Used by Layout.tsx wrapper

- [ ] `src/components/ErrorBoundary.tsx` - React Error Boundary
  - Catch React errors
  - Display fallback UI
  - Mentioned in CLAUDE.md as "not yet implemented"

- [ ] `src/constants/apiEndpoints.ts` - API endpoint constants
  - Export API routes: `/user/login`, `/user/profile`, etc.
  - Base URL configuration
  - Error messages constants

- [ ] `src/hooks/useAuth.ts` - Custom auth hook (optional)
  - Simplify Redux selector usage
  - Reusable across components

### Backend Files

- [ ] `Backend/.env` - Backend configuration (actual file, not example)
  - DATABASE_URL
  - JWT_SECRET
  - PORT
  - CORS_ORIGIN
  - NODE_ENV

- [ ] `Backend/database/models/accountModel.js` - Account schema
  - For Phase 2 transaction feature
  - Fields: accountId, accountType, accountName, balance

- [ ] `Backend/database/models/transactionModel.js` - Transaction schema
  - For Phase 2 transaction feature
  - Fields: transactionId, accountId, amount, date, description, category

### Configuration Files

- [ ] `.env.example` - Frontend environment template (if missing)
  - Template for frontend .env.local

---

## ✅ PHASE 1: USER AUTHENTICATION

### Frontend Status

- [x] Project structure initialized (React 19 + TypeScript + Vite)
- [x] Redux Toolkit setup with Auth slice
- [x] Route structure (Home, Login, Profile, NotFound)
- [x] Authentication service layer (authApi.ts)
- [x] Protected routes component
- [x] Basic pages created (Home, Login, Profile)
- [ ] API integration (currently mocked)

### Backend Status

- [x] Express.js API initialized
- [x] MongoDB connection configured
- [x] User model schema created
- [x] Authentication routes set up
- [x] JWT token validation middleware
- [ ] Database fully seeded with test data
- [ ] Swagger documentation updated for Phase 1 endpoints

### Phase 1 Checklist: User Authentication

#### Core Requirements

- [ ] **Home Page** ✓ Structure ready, needs styling refinement
  - User can visit landing page
  - Shows "Sign In" button for unauthenticated users
  - Shows "Profile" button for authenticated users

- [ ] **Login Page** - Test functionality
  - Form accepts email/password
  - Form validation (email format, required fields)
  - Success: redirect to profile with token stored
  - Error handling: display API error messages
  - Test with backend: `npm run dev` + `cd Backend && npm run dev:server`

- [ ] **Profile Page** - Test with real data
  - Only visible after successful login (ProtectedRoute working)
  - Display user information from API
  - Edit mode: allow user to edit name
  - Save changes: persist to database
  - Logout button: clears auth & redirects to home

- [ ] **Logout** - Test functionality
  - Button clears Redux state
  - Removes token from localStorage
  - Redirects to home page
  - Subsequent navigation to /profile redirects to /login

#### Frontend Tasks

- [ ] **Convert HTML Templates to TSX Components** ⭐ HIGH PRIORITY
  - [ ] **Phase 1: Layout Enhancement** - Update `src/components/Layout/Layout.tsx`
    - Add logo image from `public/assets/img/argentBankLogo.png`
    - Show authenticated user name in navbar
    - Add Font Awesome icons (fa-user-circle, fa-sign-out)
    - Conditionally show Sign In vs user+logout based on auth state
    - Match CSS classes: `main-nav`, `main-nav-logo`, `main-nav-item`
    - Add dark background wrapper (`bg-dark` class)
    - Update footer text to match template: "Copyright 2020 Argent Bank"

  - [ ] **Phase 2: Login Page** - Convert `src/pages/Login/sign-in.html` → `src/pages/Login/Login.tsx`
    - Add full structure: nav, main, footer
    - Add form wrapper with `sign-in-content` class
    - Add Font Awesome user-circle icon (`fa fa-user-circle`)
    - **⚠️ DECISION NEEDED:** Use `username` or `email` field? (HTML uses username, current code uses email)
    - Add "Remember me" checkbox
    - Update button to use `sign-in-button` class
    - Add input-wrapper styling for labels
    - Match layout and classes from sign-in.html
    - File: `/src/pages/Login/Login.tsx`

  - [ ] **Phase 3: Profile Page** - Convert `src/pages/Users/user.html` → `src/pages/Users/Profile/Profile.tsx`
    - Add welcome header: `<h1>Welcome back<br />{firstName} {lastName}!</h1>`
    - Add "Edit Name" button with functionality
    - **⚠️ DECISION NEEDED:** Edit Name - Modal dialog or inline form?
    - Add 3 account cards (fetch from API, not hardcoded)
    - Each account: title, amount, description, transaction button
    - Account card classes: `account`, `account-content-wrapper`, `account-title`, `account-amount`
    - Add Font Awesome icons in navbar (user-circle, sign-out)
    - **⚠️ DECISION NEEDED:** Get accounts from API or Redux state?
    - Match layout and styling from user.html
    - File: `/src/pages/Users/Profile/Profile.tsx`

  - [ ] **After conversion:** Delete HTML templates
    - Delete `/src/pages/Login/sign-in.html`
    - Delete `/src/pages/Users/user.html`
    - Note: Keep as reference if needed for styling review

### Implementation Strategy (Agent Approved)

1. **Layout Enhancement** - Navbar/footer match templates
2. **Login Conversion** - Full structure with form validation
3. **Profile Conversion** - Accounts display and edit functionality
4. **Testing** - Verify routing and protected routes work

### Files to Modify

- `/src/components/Layout/Layout.tsx` - Navbar/footer structure
- `/src/pages/Login/Login.tsx` - Full form with HTML structure
- `/src/pages/Users/Profile/Profile.tsx` - Welcome + accounts display
- `/src/types/index.ts` - Add Account type definition (if needed)
- `/src/features/Auth/authThunks.ts` - Fetch accounts thunk (if needed)

- [ ] **Connect Auth Thunks to Backend**
  - Verify `loginUser` thunk calls backend `/user/login`
  - Verify `fetchProfile` thunk calls backend `/user/profile`
  - Test error handling for invalid credentials

- [ ] **Update Profile API Call**
  - Implement PUT endpoint call in authThunks for profile updates
  - Handle success response (update user in Redux)
  - Handle validation errors

- [ ] **Styling & Responsive Design**
  - Ensure pages work on mobile (375px width)
  - Tablet (768px) and desktop (1440px) layouts
  - Consistent with brand if provided

- [ ] **Error Handling**
  - Display API errors in Login form
  - Display loading states (spinner/disabled button)
  - Clear error messages on form input

#### Backend Tasks

- [ ] **Seed Test Database**
  - Run: `npm run populate-db` in Backend folder
  - Verify test users created in MongoDB
  - Test credentials for manual testing

- [ ] **POST /user/login - Verify**
  - Accept: `{ email, password }`
  - Return: `{ body: { id, email, firstName, lastName, token } }`
  - Hash password validation (bcrypt)
  - Error: 400 if invalid credentials

- [ ] **POST /user/signup - Check Status** (if needed for Phase 1)
  - Accept: `{ email, password, firstName, lastName }`
  - Hash password before storing
  - Return: `{ body: { id, email, firstName, lastName, token } }`

- [ ] **GET /user/profile - Verify**
  - Requires Authorization header: `Bearer <token>`
  - Return: `{ body: { id, email, firstName, lastName } }`
  - Validate token with middleware

- [ ] **PUT /user/profile - Implement**
  - Requires Authorization header
  - Accept: `{ firstName, lastName }`
  - Update user in MongoDB
  - Return updated user data
  - Error handling for invalid token

- [ ] **Swagger Documentation**
  - Update `Backend/swagger.yaml` with auth endpoints
  - Include request/response examples

#### Testing Requirements

- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials (error message shown)
- [ ] Test logout (token cleared, redirected to home)
- [ ] Test protected route (redirect to login if not authenticated)
- [ ] Test profile page displays correct user info
- [ ] Test edit profile & persist changes
- [ ] Test page refresh maintains authentication (token in localStorage)

---

## 📊 PHASE 2: TRANSACTION API SPECIFICATION

### Requirements Summary

Users should be able to:

1. View all transactions for current month, grouped by account
2. View transaction details in a separate view
3. Add, modify, or delete transaction information

### Tasks

- [ ] **Design Transaction Data Model**
  - Define transaction schema (id, accountId, amount, date, description, category, type)
  - Define account schema
  - Plan database relationships

- [ ] **Propose API Endpoints (Swagger YAML)**
  - [ ] GET /user/accounts - List all accounts for user
    - Response: `{ accounts: [{ id, name, type, balance }] }`

  - [ ] GET /user/accounts/:accountId/transactions - List transactions for month
    - Query params: `month`, `year` (default: current)
    - Response: `{ transactions: [...], groupedByAccount: {...} }`
    - Pagination support?

  - [ ] GET /user/transactions/:transactionId - Get transaction details
    - Response: transaction object with full details

  - [ ] POST /user/transactions - Create transaction
    - Accept: `{ accountId, amount, date, description, category, type }`
    - Return: created transaction object

  - [ ] PUT /user/transactions/:transactionId - Update transaction
    - Accept: partial transaction object
    - Return: updated transaction

  - [ ] DELETE /user/transactions/:transactionId - Delete transaction
    - Response: success message or deleted transaction

- [ ] **Document Endpoints in Swagger**
  - File: `Backend/swagger.yaml`
  - Include for each endpoint:
    - HTTP method (GET, POST, PUT, DELETE)
    - Route path
    - Description
    - Parameters (path, query, body)
    - Request/response examples
    - Status codes (200, 400, 401, 404, 500)

  - [ ] Export as YAML file for submission
  - [ ] Validate against OpenAPI 3.0 spec

---

## 🛠️ Development Setup

### Frontend Setup

```bash
# Install dependencies
npm install

# Development
npm run dev              # Vite dev server (http://localhost:5173)

# Code quality
npm run lint             # Check for linting errors
npm run lint:fix         # Auto-fix linting errors
npm run format           # Format code with Prettier
npm run format:check     # Check formatting

# Build
npm run build            # Create production bundle
npm run preview          # Preview production build
```

### Backend Setup

```bash
cd Backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
# Edit .env: DATABASE_URL, JWT_SECRET, PORT, CORS_ORIGIN

# Development
npm run dev:server       # Start with nodemon auto-reload

# Database
npm run populate-db      # Seed with test data

# Production
npm run server           # Start server
```

### Environment Variables

- **Frontend** (`.env.local`)
  - `VITE_API_BASE_URL=http://localhost:3001`

- **Backend** (`Backend/.env`)
  - `DATABASE_URL=mongodb://localhost:27017/argentbank`
  - `JWT_SECRET=<your-secret-key>`
  - `PORT=3001`
  - `CORS_ORIGIN=http://localhost:5173`

---

## 📁 Key File Locations

### Frontend Source

- `src/AppRoutes.tsx` - Route definitions
- `src/App.tsx` - Root component with Redux provider
- `src/features/Auth/authSlice.ts` - Redux state management
- `src/features/Auth/authThunks.ts` - Async thunks (login, fetch profile)
- `src/services/authApi.ts` - API client (fetch-based)
- `src/types/index.ts` - TypeScript type definitions
- `src/pages/` - Page components (Home, Login, Profile)
- `src/components/ProtectedRoute.tsx` - Auth guard component
- `src/index.css` - Global styles

### Backend Source

- `Backend/server.js` - Express app entry point
- `Backend/.env` - Configuration
- `Backend/controllers/userController.js` - Request handlers
- `Backend/routes/userRoutes.js` - API route definitions
- `Backend/services/userService.js` - Business logic
- `Backend/database/models/userModel.js` - MongoDB schema
- `Backend/middleware/tokenValidation.js` - JWT validation
- `Backend/scripts/populateDatabase.js` - DB seeding
- `Backend/swagger.yaml` - API documentation

---

## 🚀 Deliverables Checklist

### Phase 1 Deliverable

- [ ] GitHub repo link (TXT file)
  - All Phase 1 requirements completed
  - Code runs without errors
  - Authentication flow works end-to-end
  - Frontend connects to backend successfully

### Phase 2 Deliverable

- [ ] `swagger.yaml` file with transaction API specification
  - All endpoints documented
  - Request/response schemas defined
  - Status codes and error handling specified
  - Valid OpenAPI 3.0 syntax

---

## 📝 Notes

### Known Issues / Gotchas

1. **CORS Configuration** - Ensure Backend CORS_ORIGIN matches frontend URL
2. **Token Storage** - Token persisted in localStorage, validate on app load
3. **Protected Routes** - Redux state checked before rendering protected pages
4. **Import Alias** - `@/` maps to `src/` (tsconfig.json configured)
5. **Environment Variables** - Copy `.env.example` to `.env` before running

### Testing Workflow

1. Start backend: `cd Backend && npm run dev:server`
2. Start frontend: `npm run dev`
3. Test login flow
4. Test profile page
5. Test logout and redirect
6. Check browser console for errors
7. Check network tab (DevTools) for API calls

### Code Quality Commands

```bash
npm run lint:fix          # Auto-fix linting issues
npm run format            # Format all code
npm run lint:styles       # Check CSS linting
```

---

## 📋 HTML TEMPLATE ANALYSIS (From Frontend Developer Agent)

### sign-in.html (Login Page) - 62 lines

**Current Structure:**

- Static navbar with logo and "Sign In" link
- Main form section with icon
- Form fields: username, password, remember-me checkbox
- Sign In button (currently hardcoded as anchor)
- Footer with copyright

**CSS Classes Used:**

- `main-nav`, `main-nav-logo`, `main-nav-logo-image`, `sr-only`
- `main`, `bg-dark`, `sign-in-content`, `sign-in-icon`
- `input-wrapper`, `input-remember`
- `sign-in-button`, `footer`

**Assets Referenced:**

- Font Awesome 4.7.0 CSS (via CDN)
- `./img/argentBankLogo.png`

### user.html (Profile Page) - 75 lines

**Current Structure:**

- Dynamic navbar with user greeting ("Tony") and logout
- Main section with welcome header and edit button
- 3 account cards (hardcoded dummy data):
  - Argent Bank Checking (x8349): $2,082.79
  - Argent Bank Savings (x6712): $10,928.42
  - Argent Bank Credit Card (x8349): $184.30
- Each account has "View transactions" button
- Footer with copyright

**CSS Classes Used:**

- `main-nav`, `main-nav-item`, `main-nav-logo`
- `header`, `edit-button`
- `account`, `account-content-wrapper`, `account-title`
- `account-amount`, `account-amount-description`
- `transaction-button`, `footer`, `bg-dark`

**Data Structure:**

```
Account {
  title: string        // e.g., "Argent Bank Checking (x8349)"
  amount: string       // e.g., "$2,082.79"
  description: string  // "Available Balance" or "Current Balance"
}
```

### Current Components vs Templates Comparison

**Login.tsx vs sign-in.html:**
| Feature | Current | Template |
|---------|---------|----------|
| Form inputs | email, password | username, password |
| Styling | Basic | Full design classes |
| Structure | Simple div | Full semantic HTML |
| Icon | Missing | fa fa-user-circle |
| Remember me | Missing | Present |
| Nav/Footer | Missing | Present |

**Profile.tsx vs user.html:**
| Feature | Current | Template |
|---------|---------|----------|
| Welcome header | Missing | "Welcome back {name}!" |
| Accounts display | Missing | 3 account cards |
| Edit button | Missing | "Edit Name" button |
| Data source | Redux user | Hardcoded accounts |
| Nav/Footer | Missing | Present |

---

**Status:** Ready for Phase 1 completion | Backend integration in progress | HTML conversion analysis complete
**Last Commit:** `6cf86d2 Init project => Dev run ok`
