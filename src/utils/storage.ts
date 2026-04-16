let inMemoryToken: string | null = null;

/** Storage strategy type */
type StorageStrategy = 'memory' | 'session' | 'local';

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

  /** Detect token location (used on app initialization) */
  detectTokenLocation(): StorageStrategy {
    if (localStorage.getItem('authToken')) {
      return 'local';
    }
    if (sessionStorage.getItem('authToken')) {
      return 'session';
    }
    return 'session';
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
  detectTokenLocation: () => storageManager.detectTokenLocation(),
};
