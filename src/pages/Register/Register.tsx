import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';

import { useToast } from '@/components/Toast/ToastContext';
import { ROUTES, BUTTONS, MESSAGES } from '@/constants';
import { clearError } from '@/features/Auth/authSlice';
import { signUpUser } from '@/features/Auth/authThunks';
import { classifySignUpError, SERVER_ERROR_MESSAGES } from '@/utils/errorHandler';
import { validateEmail, validatePassword, validateName } from '@/helpers/validator';
import { joinDescribedBy } from '@/helpers/formUtils';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectAuthLoading, selectAuthError, selectAuthToken } from '@/store/selectors';
import { FieldErrors } from '@/types';
import './styles/Register.css';

const initialFieldErrors: FieldErrors = { email: null, password: null, firstName: null, lastName: null };

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(initialFieldErrors);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const token = useAppSelector(selectAuthToken);

  useEffect(() => {
    if (token) {
      navigate(ROUTES.PROFILE);
    }
  }, [token, navigate]);

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof FieldErrors) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value);
    clearFieldError(field);
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailResult = validateEmail(email);
    const passwordResult = validatePassword(password);
    const firstNameResult = validateName(firstName, 'First name');
    const lastNameResult = validateName(lastName, 'Last name');

    const newErrors: FieldErrors = {
      email: emailResult.isValid ? null : emailResult.error,
      password: passwordResult.isValid ? null : passwordResult.error,
      firstName: firstNameResult.isValid ? null : firstNameResult.error,
      lastName: lastNameResult.isValid ? null : lastNameResult.error,
    };

    if (!emailResult.isValid || !passwordResult.isValid || !firstNameResult.isValid || !lastNameResult.isValid) {
      setFieldErrors(newErrors);
      return;
    }

    const result = await dispatch(signUpUser({ email: email.trim(), password, firstName: firstName.trim(), lastName: lastName.trim() }));

    if (signUpUser.fulfilled.match(result)) {
      toast.show('Account created', MESSAGES.REGISTER_SUCCESS, 'success');
      navigate(ROUTES.PROFILE);
    } else if (signUpUser.rejected.match(result) && result.payload === SERVER_ERROR_MESSAGES.SIGN_UP_EMAIL_EXISTS) {
      setFieldErrors((prev) => ({ ...prev, email: SERVER_ERROR_MESSAGES.SIGN_UP_EMAIL_EXISTS }));
      dispatch(clearError());
    }
  };

  const { generalError: generalServerError } = classifySignUpError(error);

  const emailDescribedBy = joinDescribedBy(fieldErrors.email && 'register-email-error', generalServerError && 'register-server-error');
  const passwordDescribedBy = joinDescribedBy('register-password-hint', fieldErrors.password && 'register-password-error', generalServerError && 'register-server-error');
  const firstNameDescribedBy = joinDescribedBy(fieldErrors.firstName && 'register-first-name-error');
  const lastNameDescribedBy = joinDescribedBy(fieldErrors.lastName && 'register-last-name-error');

  return (
    <div className="sign-in-page">
      <div className="sign-in-panel">
        <section className="sign-in-content">
          <h1>Create an account</h1>
          <p className="sign-in-sub">Join Argent Bank today</p>

          <form noValidate onSubmit={handleSubmit}>
            <div className="input-wrapper">
              <label htmlFor="firstName">First name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                autoComplete="given-name"
                placeholder="John"
                value={firstName}
                onChange={handleChange(setFirstName, 'firstName')}
                aria-invalid={fieldErrors.firstName ? true : undefined}
                aria-describedby={firstNameDescribedBy}
              />
              {fieldErrors.firstName && (
                <p className="field-error" id="register-first-name-error" role="alert">
                  {fieldErrors.firstName}
                </p>
              )}
            </div>

            <div className="input-wrapper">
              <label htmlFor="lastName">Last name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                autoComplete="family-name"
                placeholder="Doe"
                value={lastName}
                onChange={handleChange(setLastName, 'lastName')}
                aria-invalid={fieldErrors.lastName ? true : undefined}
                aria-describedby={lastNameDescribedBy}
              />
              {fieldErrors.lastName && (
                <p className="field-error" id="register-last-name-error" role="alert">
                  {fieldErrors.lastName}
                </p>
              )}
            </div>

            <div className="input-wrapper">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleChange(setEmail, 'email')}
                aria-invalid={fieldErrors.email || generalServerError ? true : undefined}
                aria-describedby={emailDescribedBy}
              />
              {fieldErrors.email && (
                <p className="field-error" id="register-email-error" role="alert">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="input-wrapper">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="new-password"
                placeholder=""
                value={password}
                onChange={handleChange(setPassword, 'password')}
                aria-invalid={fieldErrors.password || generalServerError ? true : undefined}
                aria-describedby={passwordDescribedBy}
              />
              <p className="form-help" id="register-password-hint">
                At least 8 characters, one uppercase letter, and one number.
              </p>
              {fieldErrors.password && (
                <p className="field-error" id="register-password-error" role="alert">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {generalServerError && (
              <p className="field-error field-error--server" id="register-server-error" role="alert">
                {generalServerError}
              </p>
            )}

            <button type="submit" className="btn btn-primary btn-full btn-elevated" disabled={loading}>
              {loading ? MESSAGES.SIGNUP_PENDING : BUTTONS.REGISTER}
            </button>

            <p className="register-link">
              Already have an account? <Link to={ROUTES.LOGIN}>Sign in</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
};
