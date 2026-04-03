import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { ToastContainer, useToast } from '@/components/Toast';
import { ROUTES, BUTTONS, MESSAGES } from '@/constants';
import { updateUserProfile } from '@/features/Auth/authThunks';
import { validateName } from '@/helpers/validator';
import { AppDispatch, RootState } from '@/store/store';
import { extractErrorMessage } from '@/utils/errorHandler';
import './styles/Settings.css';

export const Settings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token } = useSelector((state: RootState) => state.auth);
  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName] = useState(user?.lastName ?? '');
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

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

    const result = await dispatch(updateUserProfile({ token, firstName, lastName }));
    if (updateUserProfile.fulfilled.match(result)) {
      toast.show('Profile updated', MESSAGES.PROFILE_UPDATED);
    } else {
      const message = extractErrorMessage(result.payload, 'Failed to update profile');
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

      <form className="settings-form" onSubmit={handleSubmit}>
        <h2 className="settings-section-title">Profile Information</h2>

        <div className="settings-field settings-field-full">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={user.email} disabled aria-describedby="email-hint" />
          <span className="settings-hint" id="email-hint">
            Email cannot be changed
          </span>
        </div>

        <div className="settings-name-row">
          <div className="settings-field">
            <label htmlFor="settings-firstName">First Name</label>
            <input type="text" id="settings-firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>
          <div className="settings-field">
            <label htmlFor="settings-lastName">Last Name</label>
            <input type="text" id="settings-lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>
        </div>

        <div className="settings-actions">
          <button type="button" className="settings-cancel-btn" onClick={handleCancel}>
            {BUTTONS.CANCEL}
          </button>
          <button type="submit" className="settings-save-btn">
            {BUTTONS.SAVE}
          </button>
        </div>
      </form>

      <ToastContainer toasts={toast.toasts} />
    </div>
  );
};
