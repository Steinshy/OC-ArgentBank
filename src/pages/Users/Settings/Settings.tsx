import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import { useToast } from '@/components/Toast/ToastContext';
import { ROUTES, BUTTONS, MESSAGES } from '@/constants';
import { useGetProfileQuery, useUpdateProfileMutation } from '@/api/argentBankApi';
import { validateName } from '@/helpers/validator';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { extractErrorMessage } from '@/utils/errorHandler';
import { logoutUser } from '@/features/Auth/authThunks';
import './styles/Settings.css';

export const Settings = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: user, isError } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
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
    if (!firstNameValidation.isValid) {
      toast.show('Validation error', firstNameValidation.error!, 'error');
      return;
    }

    const lastNameValidation = validateName(lastName, 'Last name');
    if (!lastNameValidation.isValid) {
      toast.show('Validation error', lastNameValidation.error!, 'error');
      return;
    }

    const result = await updateProfile({ firstName, lastName });
    if ('data' in result) {
      toast.show('Profile updated', MESSAGES.PROFILE_UPDATED);
      setTimeout(() => navigate(ROUTES.PROFILE), 500);
    } else {
      const message = extractErrorMessage(result.error, 'Failed to update profile');
      toast.show('Error', message, 'error');
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.PROFILE);
  };

  if (!user) return null;

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

        <div className="settings-field settings-field-full">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={user.email} disabled aria-describedby="email-hint" autoComplete="email" />
          <span className="settings-hint" id="email-hint">
            Email cannot be changed
          </span>
        </div>

        <div className="settings-name-row">
          <div className="settings-field">
            <label htmlFor="settings-firstName">First Name</label>
            <input type="text" id="settings-firstName" name="firstName" autoComplete="given-name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="settings-field">
            <label htmlFor="settings-lastName">Last Name</label>
            <input type="text" id="settings-lastName" name="lastName" autoComplete="family-name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>

        <div className="settings-actions">
          <button type="button" className="btn btn-secondary" onClick={handleCancel}>
            {BUTTONS.CANCEL}
          </button>
          <button type="submit" className="btn btn-primary">
            {BUTTONS.SAVE}
          </button>
        </div>
      </form>
    </div>
  );
};
