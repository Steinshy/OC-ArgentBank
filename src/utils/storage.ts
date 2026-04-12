/** In-memory token storage (most secure but lost on page refresh) */
let inMemoryToken: string | null = null;

/**
 * Storage strategy type.
 *
 * SECURITY NOTE: The `local` strategy uses `localStorage`, which persists the
 * token across browser sessions and is fully accessible to any JavaScript that
 * runs on the page — including injected scripts from XSS. Prefer `session` or
 * `memory` for production. `local` is provided only for development / opt-in
 * scenarios and should never be enabled by default.
 */
type StorageStrategy = 'memory' | 'session' | 'local';

/**
 * Token storage manager with multiple strategies
 *
 * Strategy comparison:
 * - 'memory': Most secure (not persisted), lost on page refresh
 * - 'session': Good balance (cleared when tab closes), survives page refresh
 * - 'local': Traditional approach (persists across sessions), XSS vulnerable
 *
 * Recommendation: Use 'session' by default
 */
class TokenStorageManager {
  private strategy: StorageStrategy = 'session';

  constructor(strategy: StorageStrategy = 'session') {
    this.strategy = strategy;
  }

  /** Get auth token */
  getAuthToken(): string | null {
    switch (this.strategy) {
      case 'memory':
        return inMemoryToken;
      case 'session':
        return sessionStorage.getItem('authToken');
      case 'local':
        return localStorage.getItem('authToken');
      default:
        return null;
    }
  }

  /** Set auth token */
  setAuthToken(token: string): void {
    switch (this.strategy) {
      case 'memory':
        inMemoryToken = token;
        break;
      case 'session':
        sessionStorage.setItem('authToken', token);
        break;
      case 'local':
        localStorage.setItem('authToken', token);
        break;
    }
  }

  /** Remove auth token */
  removeAuthToken(): void {
    switch (this.strategy) {
      case 'memory':
        inMemoryToken = null;
        break;
      case 'session':
        sessionStorage.removeItem('authToken');
        break;
      case 'local':
        localStorage.removeItem('authToken');
        break;
    }
  }

  /** Change storage strategy */
  setStrategy(strategy: StorageStrategy): void {
    const currentToken = this.getAuthToken();
    this.strategy = strategy;
    if (currentToken) {
      this.setAuthToken(currentToken);
    }
  }

  /** Get current strategy */
  getStrategy(): StorageStrategy {
    return this.strategy;
  }
}

// Default instance using sessionStorage (recommended)
const storageManager = new TokenStorageManager('session');

export const storage = {
  getAuthToken: () => storageManager.getAuthToken(),
  setAuthToken: (token: string) => storageManager.setAuthToken(token),
  removeAuthToken: () => storageManager.removeAuthToken(),
  setStrategy: (strategy: StorageStrategy) => storageManager.setStrategy(strategy),
  getStrategy: () => storageManager.getStrategy(),
};
