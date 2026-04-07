export const storage = {
  getAuthToken: (): string | null => localStorage.getItem('authToken'),
  setAuthToken: (token: string): void => localStorage.setItem('authToken', token),
  removeAuthToken: (): void => localStorage.removeItem('authToken'),
};
