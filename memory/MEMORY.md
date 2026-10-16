---
name: ArgentBank Project Memory
description: React SPA with Redux state management and authentication
type: React SPA
project: ArgentBank
category: React Application
phase: Active Development
updated: 2026-03-23
tags:
  - React
  - TypeScript
  - Redux
  - Authentication
  - JWT
  - MongoDB
  - API Integration
  - State Management
---

# ArgentBank Memory Index

**Last Consolidated:** March 23, 2026

## Quick Reference

Need to create ADR

| Section                                     | Purpose                                          |
| ------------------------------------------- | ------------------------------------------------ |
| [Component Patterns](component_patterns.md) | Layout structure, form components, account views |
| [Redux Setup](state_patterns.md)            | Actions, reducers, selectors, async thunks       |
| [Authentication](authentication.md)         | JWT tokens, login/logout flow, protected routes  |
| [API Integration](api_integration.md)       | REST endpoints, error handling, token refresh    |
| [Form Patterns](forms.md)                   | Login form, account settings, validation         |
| [Testing Strategy](testing_strategy.md)     | Jest, React Testing Library, Redux testing       |

## Project Overview

**ArgentBank** is a banking dashboard where users can log in, view accounts, and manage account settings.

- **Tech Stack:** React 19 + TypeScript + Redux + Vite
- **Backend:** Express.js API with MongoDB
- **Authentication:** JWT-based user authentication
- **State:** Redux for complex auth + dashboard state
- **Testing:** Jest + React Testing Library
- **Build:** Vite with PWA support

## Phase & Status

- **Phase:** Active Development
- **Memory Status:** ✅ Index created, Redux patterns pending detailed documentation
- **Next Review:** April 20, 2026

## Key Learnings by Category

### Authentication Flow

- **Pattern:** JWT-based authentication with token storage
- **Login:** POST /user/login → receives token → stored in localStorage/Redux
- **Protected Routes:** Wrapper component checks Redux auth state
- **Token Refresh:** Intercept 401 responses, request new token automatically
- **Logout:** Clear token from storage and Redux state

### Redux Architecture

- **Slices:** `authSlice` (login/logout), `userSlice` (user profile), `accountsSlice` (account list)
- **Async Thunks:** `loginUser` fetches token and profile in one action
- **Selectors:** `selectIsAuthenticated`, `selectUserProfile`, `selectAccounts`
- **Middleware:** Custom middleware for token refresh, error logging
- **Persistence:** Store token in localStorage, other state in memory

### Component Organization

- **Pages:** Login page, Dashboard page, Account details page
- **Layout:** Header with user menu, sidebar navigation, main content area
- **Forms:** Reusable form wrapper with validation
- **Cards:** Account card component with balance and recent transactions

### API Integration

- **Base URL:** Configured in environment, changeable for testing
- **Endpoints:**
  - POST /user/login (credentials)
  - GET /user/profile (protected)
  - GET /user/accounts (protected)
  - PUT /user/accounts/{id} (protected)
- **Headers:** Authorization bearer token automatically added
- **Errors:** Catch 401 → refresh token → retry

### Form Validation

- **Strategy:** Client-side validation before submission
- **Fields:** Email (format), password (length), account nickname
- **Feedback:** Real-time error messages, disabled submit button if invalid
- **Submission:** Dispatch async thunk, show loading state, redirect on success

### Testing Focus

- **Authentication Tests:** Mock login, verify token storage, protected route access
- **Redux Tests:** Actions and reducers with mocked async thunks
- **Component Tests:** Verify forms work with Redux state
- **E2E:** Full login → view accounts → update settings flow

## Related Files

- **Redux store:** `src/store/`
- **API client:** `src/services/api.ts`
- **Auth context/Redux:** `src/features/auth/`
- **Components:** `src/components/`
- **Project config:** CLAUDE.md (overview), package.json (dependencies)

## Monthly Review Checklist

- [ ] Verify authentication flow still works
- [ ] Check token refresh logic
- [ ] Review Redux state structure for redundancy
- [ ] Audit error handling in API integration
- [ ] Update form validation rules if needed

---

**Next Step:** Create detailed state_patterns.md and authentication.md files.
