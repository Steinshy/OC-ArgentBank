# Architecture Decision Records

This document records key architectural decisions made in the Argent Bank project.

---

## ADR-001: Redux Toolkit for State Management

**Status:** Accepted  
**Date:** March 2026

### Context

The application requires global state management for authentication, user profile, and transaction data that needs to be shared across multiple components.

### Decision

Use Redux Toolkit (RTK) with the following patterns:
- Feature-based slices in `src/features/`
- Async operations via `createAsyncThunk`
- Typed hooks via `AppDispatch` and `RootState`

### Rationale

- RTK reduces Redux boilerplate significantly
- Built-in Immer for immutable updates
- DevTools integration out of the box
- TypeScript support is excellent
- Industry standard for complex React apps

### Consequences

- Learning curve for developers unfamiliar with Redux
- Slightly more code than lightweight alternatives (Zustand, Jotai)
- Excellent debugging capabilities via Redux DevTools

---

## ADR-002: Feature-Based Folder Structure

**Status:** Accepted  
**Date:** March 2026

### Context

Need a scalable folder structure that supports team collaboration and feature isolation.

### Decision

Organize code by feature/domain rather than by type:

```
src/
├── features/           # Redux slices by domain
│   ├── Auth/
│   └── Transactions/
├── pages/              # Route-level components
├── components/         # Shared UI components
├── api/                # API client layer
├── constants/          # Application constants
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── types/              # TypeScript definitions
```

### Rationale

- Features are self-contained and easier to understand
- Reduces cross-feature dependencies
- Easier to delete/refactor features
- Clear ownership boundaries for teams

### Consequences

- May have some code duplication across features
- Shared utilities need clear home (`utils/`, `components/`)

---

## ADR-003: Centralized Constants

**Status:** Accepted  
**Date:** March 2026

### Context

Magic strings and numbers were scattered across the codebase, leading to inconsistency and maintenance burden.

### Decision

Extract all constants to `src/constants/` with domain-specific files:
- `api.ts` - API endpoints and configuration
- `routes.ts` - Route paths
- `storage.ts` - localStorage keys
- `ui.ts` - UI text, labels, messages
- `transactions.ts` - Transaction-specific constants

Export everything through `index.ts` for clean imports:

```typescript
import { ROUTES, API_ENDPOINTS, STORAGE_KEYS } from '@/constants';
```

### Rationale

- Single source of truth for all constants
- Easy to find and update values
- Prevents typos in string literals
- Enables IDE autocomplete

### Consequences

- Additional indirection layer
- Must remember to add new constants to index exports

---

## ADR-004: Typed localStorage Wrapper

**Status:** Accepted  
**Date:** April 2026

### Context

Direct `localStorage` calls were scattered across components with inconsistent key names.

### Decision

Create `src/utils/storage.ts` with typed methods:

```typescript
export const storage = {
  getAuthToken: () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN),
  setAuthToken: (token: string) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  removeAuthToken: () => localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN),
  // ...
};
```

### Rationale

- Type safety for storage operations
- Centralized key management via constants
- Easier to mock in tests
- Single place to add validation/encryption if needed

### Consequences

- All storage access must go through wrapper
- Minor overhead vs direct localStorage

---

## ADR-005: Fetch-based API Client (No Axios)

**Status:** Accepted  
**Date:** March 2026

### Context

Need an HTTP client for API communication.

### Decision

Use native `fetch` API with a custom wrapper in `src/api/client.ts`:

```typescript
export async function apiCall<T>(endpoint: string, options?: RequestInit & { token?: string }): Promise<T>
```

### Rationale

- No additional dependencies
- Fetch is native and well-supported
- Smaller bundle size
- Sufficient for our API needs
- TypeScript generics provide type safety

### Consequences

- Manual error handling (no interceptors like Axios)
- Must handle JSON parsing explicitly
- No automatic request/response transformation

---

## ADR-006: Error Boundary Pattern

**Status:** Accepted  
**Date:** April 2026

### Context

Runtime errors in React components would crash the entire application.

### Decision

Implement `ErrorBoundary` class component wrapping the app root:

```tsx
<ErrorBoundary>
  <Provider store={store}>
    <BrowserRouter>
      <Layout>...</Layout>
    </BrowserRouter>
  </Provider>
</ErrorBoundary>
```

### Rationale

- Prevents full app crashes from component errors
- Provides user-friendly fallback UI
- Logs errors for debugging
- Reset mechanism allows recovery

### Consequences

- Only catches render errors (not event handlers, async)
- Class component required (hooks don't support error boundaries yet)

---

## ADR-007: CSS Organization

**Status:** Accepted  
**Date:** March 2026

### Context

Need a maintainable CSS architecture that scales with the application.

### Decision

Use vanilla CSS with the following structure:
- Global styles in `src/index.css`
- Component styles in `ComponentName/styles/ComponentName.css`
- CSS variables in `variables.css` for theming

### Rationale

- No build-time CSS processing complexity
- Easy to understand and debug
- CSS variables provide theming capability
- Co-located styles are easy to find

### Alternatives Considered

- CSS Modules: Added complexity not needed for this project size
- Tailwind: Team preference for traditional CSS
- Styled-components: Runtime overhead, different paradigm

### Consequences

- No automatic scoping (must be careful with class names)
- Manual handling of vendor prefixes if needed

---

## ADR-008: Path Aliases (@/)

**Status:** Accepted  
**Date:** March 2026

### Context

Deep relative imports (`../../../components/`) are hard to read and refactor.

### Decision

Configure `@/` alias to map to `src/` in both TypeScript and Vite:

```typescript
// tsconfig.json
"paths": { "@/*": ["./src/*"] }

// vite.config.ts
resolve: { alias: { '@': '/src' } }
```

### Rationale

- Clean, consistent imports
- Easy to move files without updating imports
- Clear distinction between project code and node_modules

### Consequences

- IDE must be configured to understand alias
- Must keep tsconfig and vite.config in sync

---

## ADR-009: Custom Hooks for State Access

**Status:** Accepted  
**Date:** April 2026

### Context

Components repeatedly write the same useSelector/useDispatch patterns for auth and transactions.

### Decision

Create custom hooks in `src/hooks/`:
- `useAuth()` - Auth state + login/logout/profile actions
- `useTransactions()` - Transaction state + fetch/update actions

### Rationale

- Reduces boilerplate in components
- Encapsulates Redux implementation details
- Easier to test components
- Single place to modify state access patterns

### Consequences

- Additional abstraction layer
- Hooks must be kept in sync with slice changes

---

## ADR-010: Environment Configuration

**Status:** Accepted  
**Date:** March 2026

### Context

Need to configure API URLs and other settings per environment.

### Decision

Use Vite's built-in environment variable system:
- `.env.example` as template (committed)
- `.env.local` for local overrides (gitignored)
- `VITE_` prefix for client-exposed variables
- Type definitions in `src/types/env.d.ts`

### Rationale

- Vite handles env injection automatically
- Type safety for environment variables
- Standard pattern for Vite projects

### Consequences

- Variables must have `VITE_` prefix to be exposed
- Rebuild required for env changes in production

---

## Future Considerations

### Potential ADRs to Add

1. **Testing Strategy** - Unit vs integration vs E2E balance
2. **Internationalization** - i18n library choice if needed
3. **Performance Monitoring** - Error tracking and analytics
4. **API Versioning** - How to handle API version changes
5. **Code Splitting** - Route-based lazy loading strategy
