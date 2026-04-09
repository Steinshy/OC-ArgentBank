import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

import { ROUTES, BUTTONS, MESSAGES } from '@/constants';
import { clearError } from '@/features/Auth/authSlice';
import { signInUser } from '@/features/Auth/authThunks';
import { classifySignInError } from '@/utils/errorHandler';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { joinDescribedBy } from '@/utils/aria';
import './styles/SignIn.css';

export const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailValidationError, setEmailValidationError] = useState('');
  const [passwordValidationError, setPasswordValidationError] = useState('');
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
    if (emailValidationError) {
      setEmailValidationError('');
    }
    if (error) {
      dispatch(clearError());
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (passwordValidationError) {
      setPasswordValidationError('');
    }
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = (): boolean => {
    let isValid = true;
    if (!email.trim()) {
      setEmailValidationError('Email is required');
      isValid = false;
    }
    if (!password) {
      setPasswordValidationError('Password is required');
      isValid = false;
    }
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const result = await dispatch(signInUser({ email: email.trim(), password }));
    if (signInUser.fulfilled.match(result)) {
      navigate(ROUTES.PROFILE);
    }
  };

  const { emailError: emailServerError, passwordError: passwordServerError, generalError: generalServerError } = classifySignInError(error);
  const emailError = emailValidationError || emailServerError;
  const passwordError = passwordValidationError || passwordServerError;

  const emailDescribedBy = joinDescribedBy(emailError && 'sign-in-email-error', generalServerError && 'sign-in-server-error');
  const passwordDescribedBy = joinDescribedBy(passwordError && 'sign-in-password-error', generalServerError && 'sign-in-server-error');

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
                aria-invalid={emailError || generalServerError ? true : undefined}
                aria-describedby={emailDescribedBy}
              />
              {emailError && (
                <p className="form-error" id="sign-in-email-error" role="alert">
                  {emailError}
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
                aria-invalid={passwordError || generalServerError ? true : undefined}
                aria-describedby={passwordDescribedBy}
              />
              {passwordError && (
                <p className="form-error" id="sign-in-password-error" role="alert">
                  {passwordError}
                </p>
              )}
            </div>
            {generalServerError && (
              <p className="form-error form-error--server" id="sign-in-server-error" role="alert">
                {generalServerError}
              </p>
            )}
            <button type="submit" className="btn btn-primary btn-full btn-elevated" disabled={loading}>
              {loading ? MESSAGES.SIGNIN_PENDING : BUTTONS.SIGN_IN}
            </button>
            <p className="register-link">
              Don't have an account? <Link to={ROUTES.REGISTER}>Register</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};
