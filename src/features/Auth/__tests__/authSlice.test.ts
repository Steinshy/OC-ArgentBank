import authReducer, { setToken, clearAuth, setError, clearError } from '@/features/Auth/authSlice';
import { signInUser, signUpUser, logoutUser } from '@/features/Auth/authThunks';
import type { AuthState } from '@/types';

const makeInitial = (overrides: Partial<AuthState> = {}): AuthState => ({
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  ...overrides,
});

describe('authSlice reducers', () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
  });

  it('setToken stores token and flips isAuthenticated', () => {
    const state = authReducer(makeInitial(), setToken('abc'));
    expect(state.token).toBe('abc');
    expect(state.isAuthenticated).toBe(true);
  });

  it('clearAuth resets token + error and flips isAuthenticated off', () => {
    const state = authReducer(makeInitial({ token: 'abc', isAuthenticated: true, error: 'x' }), clearAuth());
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBeNull();
  });

  it('setError / clearError manage the error field', () => {
    const withError = authReducer(makeInitial(), setError('boom'));
    expect(withError.error).toBe('boom');
    expect(authReducer(withError, clearError()).error).toBeNull();
  });
});

describe('authSlice extraReducers', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('signInUser.pending flips loading on and clears error', () => {
    const state = authReducer(makeInitial({ error: 'prev' }), { type: signInUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('signInUser.fulfilled stores the token and sets isAuthenticated', () => {
    const state = authReducer(makeInitial({ loading: true }), { type: signInUser.fulfilled.type, payload: { token: 'jwt' } });
    expect(state.loading).toBe(false);
    expect(state.token).toBe('jwt');
    expect(state.isAuthenticated).toBe(true);
  });

  it('signInUser.rejected stores the error message', () => {
    const state = authReducer(makeInitial({ loading: true }), { type: signInUser.rejected.type, payload: 'nope' });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('nope');
    expect(state.isAuthenticated).toBe(false);
  });

  it('signUpUser.fulfilled stores the token', () => {
    const state = authReducer(makeInitial(), { type: signUpUser.fulfilled.type, payload: { token: 'jwt2' } });
    expect(state.token).toBe('jwt2');
    expect(state.isAuthenticated).toBe(true);
  });

  it('logoutUser.fulfilled clears auth state', () => {
    const state = authReducer(makeInitial({ token: 'jwt', isAuthenticated: true }), { type: logoutUser.fulfilled.type });
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});
