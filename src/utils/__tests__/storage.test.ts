import { storage } from '../storage';

describe('Token Storage', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should set and get auth token', () => {
    const token = 'test-token';
    storage.setAuthToken(token);
    expect(storage.getAuthToken()).toBe(token);
  });

  it('should remove auth token', () => {
    storage.setAuthToken('test-token');
    storage.removeAuthToken();
    expect(storage.getAuthToken()).toBeNull();
  });

  it('should use sessionStorage by default', () => {
    expect(storage.getStrategy()).toBe('session');
  });
});
