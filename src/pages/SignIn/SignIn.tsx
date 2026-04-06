import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { ROUTES, BUTTONS, MESSAGES } from '@/constants';
import { clearError } from '@/features/Auth/authSlice';
import { signInUser } from '@/features/Auth/authThunks';
import { SIGN_IN_PASSWORD_INVALID, SIGN_IN_USER_NOT_FOUND } from '@/helpers/signInServerMessages';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { storage } from '@/utils/storage';
import './styles/SignIn.css';

const joinDescribedBy = (...ids: (string | undefined | null | false)[]): string | undefined => {
  const joined = ids.filter(Boolean).join(' ');
  return joined || undefined;
};

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token) {
      navigate(ROUTES.PROFILE);
    }
  }, [token, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      dispatch(clearError());
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(signInUser({ email: email.trim(), password }));
    if (signInUser.fulfilled.match(result)) {
      if (rememberMe) {
        storage.setRememberMe(email.trim());
      }
      navigate(ROUTES.PROFILE);
    }
  };

  const emailServerError = error === SIGN_IN_USER_NOT_FOUND ? error : null;
  const passwordServerError = error === SIGN_IN_PASSWORD_INVALID ? error : null;
  const generalServerError = error && !emailServerError && !passwordServerError ? error : null;

  const emailDescribedBy = joinDescribedBy(emailServerError && 'sign-in-email-error', generalServerError && 'sign-in-server-error');
  const passwordDescribedBy = joinDescribedBy(passwordServerError && 'sign-in-password-error', generalServerError && 'sign-in-server-error');

  return (
    <div className="sign-in-page">
      <div className="sign-in-panel">
        <section className="sign-in-content">
          <h2>Welcome back</h2>
          <p className="sign-in-sub">Sign in to your account</p>

          <form noValidate onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                aria-invalid={emailServerError || generalServerError ? true : undefined}
                aria-describedby={emailDescribedBy}
              />
              {emailServerError && (
                <p className="field-error" id="sign-in-email-error" role="alert">
                  {emailServerError}
                </p>
              )}
            </div>
            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                aria-invalid={passwordServerError || generalServerError ? true : undefined}
                aria-describedby={passwordDescribedBy}
              />
              {passwordServerError && (
                <p className="field-error" id="sign-in-password-error" role="alert">
                  {passwordServerError}
                </p>
              )}
            </div>
            {generalServerError && (
              <p className="field-error field-error-server" id="sign-in-server-error" role="alert">
                {generalServerError}
              </p>
            )}
            <div className="input-remember">
              <input type="checkbox" id="remember-me" name="rememberMe" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit" className="sign-in-button" disabled={loading}>
              {loading ? MESSAGES.SIGNING_IN : BUTTONS.SIGN_IN}
            </button>
          </form>
        </section>
      </div>
    </div>
  );

};
