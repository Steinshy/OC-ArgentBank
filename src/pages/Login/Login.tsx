import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { ROUTES, BUTTONS, MESSAGES } from '@/constants';
import { clearError } from '@/features/Auth/authSlice';
import { loginUser, fetchUserProfile } from '@/features/Auth/authThunks';
import { validateEmail, validatePassword } from '@/helpers/validator';
import { AppDispatch, RootState } from '@/store/store';
import { storage } from '@/utils/storage';
import './styles/Login.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      navigate(ROUTES.PROFILE);
    }
  }, [token, navigate]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFormError(null);
    if (error) {
      dispatch(clearError());
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFormError(null);
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      setFormError(emailValidation.error);
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setFormError(passwordValidation.error);
      return;
    }

    const result = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(result)) {
      if (rememberMe) {
        storage.setRememberMe(email);
      }
      await dispatch(fetchUserProfile(result.payload.token));
      navigate(ROUTES.PROFILE);
    }
  };

  const displayError = formError ?? error;

  return (
    <section className="sign-in-content">
      <i className="fa fa-user-circle sign-in-icon" aria-hidden="true"></i>
      <h1>{BUTTONS.SIGN_IN}</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={email} onChange={handleEmailChange} required />
        </div>
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={handlePasswordChange} required />
        </div>
        <div className="input-remember">
          <input type="checkbox" id="remember-me" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
          <label htmlFor="remember-me">Remember me</label>
        </div>
        <button type="submit" className="sign-in-button" disabled={loading}>
          {loading ? MESSAGES.SAVING : BUTTONS.SIGN_IN}
        </button>
        {displayError && (
          <p className="error-message" role="alert">
            {displayError}
          </p>
        )}
      </form>
    </section>
  );
};
