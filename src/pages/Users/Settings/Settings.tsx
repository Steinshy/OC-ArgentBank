import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useToast } from '@/components/Toast/ToastContext';
import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { ROUTES, BUTTONS, MESSAGES } from '@/constants';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/api/argentBankApi';
import { validateName } from '@/helpers/validator';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectIsAuthenticated } from '@/store/selectors';
import { extractErrorMessage, ERROR_MESSAGES } from '@/utils/errorHandler';
import { logoutUser } from '@/features/Auth/authThunks';
import './styles/Settings.css';

export const Settings = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: user, isError } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const [firstNameError, setFirstNameError] = useState<string | null>(null);
  const [lastNameError, setLastNameError] = useState<string | null>(null);
  const [updateProfile] = useUpdateProfileMutation();
  const toast = useToast();

  useEffect(() => {
    if (isError) {
      dispatch(logoutUser());
      navigate(ROUTES.LOGIN);
    }
  }, [isError, dispatch, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const firstNameValidation = validateName(firstName, 'First name');
    const lastNameValidation = validateName(lastName, 'Last name');
    const fnError = firstNameValidation.isValid ? null : firstNameValidation.error;
    const lnError = lastNameValidation.isValid ? null : lastNameValidation.error;
    setFirstNameError(fnError);
    setLastNameError(lnError);

    if (fnError || lnError) {
      return;
    }

    const result = await updateProfile({ firstName, lastName });
    if ('data' in result) {
      toast.show('Profile updated', MESSAGES.PROFILE_UPDATED);
      setTimeout(() => navigate(ROUTES.PROFILE), 500);
    } else {
      const message = extractErrorMessage(result.error, ERROR_MESSAGES.PROFILE_UPDATE_FAILED);
      toast.show('Error', message, 'error');
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PROFILE);
  };

  if (!user) {
    return (
      <div className="settings-page">
        <div className="settings-header">
          <div className="skeleton skeleton-avatar" />
          <div className="settings-header-info">
            <div style={{ height: '1.5rem', width: '60%' }} className="skeleton" />
            <div style={{ height: '1rem', width: '40%', marginTop: '0.5rem' }} className="skeleton" />
          </div>
        </div>
        <SkeletonLoader variant="form-field" count={3} label="Loading profile form" />
      </div>
    );
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div className="settings-avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="settings-header-info">
          <h1 className="settings-title">
            {user.firstName} {user.lastName}
          </h1>
          <p className="settings-email">{user.email}</p>
        </div>
      </div>

      <form key={user?.id} className="settings-form" onSubmit={handleSubmit}>
        <h2 className="settings-section-title">Profile Information</h2>

        <div className="settings-field">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={user.email} disabled aria-describedby="email-hint" autoComplete="email" />
          <span className="settings-hint" id="email-hint">
            Email cannot be changed
          </span>
        </div>

        <div className="settings-name-row">
          <div className="settings-field">
            <label htmlFor="settings-firstName">First Name</label>
            <input
              type="text"
              id="settings-firstName"
              name="firstName"
              autoComplete="given-name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                if (firstNameError) setFirstNameError(null);
              }}
              aria-invalid={firstNameError ? true : undefined}
              aria-describedby={firstNameError ? 'settings-firstName-error' : undefined}
              required
            />
            {firstNameError && (
              <p className="field-error" id="settings-firstName-error" role="alert">
                {firstNameError}
              </p>
            )}
          </div>
          <div className="settings-field">
            <label htmlFor="settings-lastName">Last Name</label>
            <input
              type="text"
              id="settings-lastName"
              name="lastName"
              autoComplete="family-name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                if (lastNameError) setLastNameError(null);
              }}
              aria-invalid={lastNameError ? true : undefined}
              aria-describedby={lastNameError ? 'settings-lastName-error' : undefined}
              required
            />
            {lastNameError && (
              <p className="field-error" id="settings-lastName-error" role="alert">
                {lastNameError}
              </p>
            )}
          </div>
        </div>

        <div className="settings-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={handleCancel}>
            {BUTTONS.CANCEL}
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            {BUTTONS.SAVE}
          </button>
        </div>
      </form>
    </div>
  );
};
