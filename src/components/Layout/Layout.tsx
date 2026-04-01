import { ReactNode, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router';

import { ROUTES, BUTTONS, MESSAGES, NAVIGATION, getCopyrightText } from '@/constants';
import { updateUserProfile } from '@/features/Auth/authThunks';
import { AppDispatch, RootState } from '@/store/store';
import { storage } from '@/utils/storage';
import './styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, token, loading } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === ROUTES.LOGIN;
  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');

  const handleEditNameClick = () => {
    setIsEditingName(true);
  };

  const handleSaveName = async () => {
    if (token && user) {
      const result = await dispatch(updateUserProfile({ token, firstName, lastName }));
      if (updateUserProfile.fulfilled.match(result)) {
        setIsEditingName(false);
      }
    }
  };

  const handleCancelEdit = () => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setIsEditingName(false);
  };

  const handleLogout = () => {
    storage.removeAuthToken();
    navigate(ROUTES.HOME);
    window.location.reload();
  };

  return (
    <div className="layout">
      <nav className="main-nav">
        <Link className="main-nav-logo" to={ROUTES.HOME}>
          <img className="main-nav-logo-image" src="/assets/img/argentBankLogo.png" alt={NAVIGATION.HOME_LOGO_ALT} />
          <h1 className="sr-only">Argent Bank</h1>
        </Link>
        <div>
          {isAuthenticated && user ? (
            <>
              <div className="profile-dropdown">
                <button className="main-nav-item unstyled-button" onClick={handleEditNameClick}>
                  <i className="fa fa-user-circle"></i>
                  {user.firstName}
                </button>
                {isEditingName && (
                  <div className="dropdown-menu">
                    <div className="input-wrapper">
                      <label htmlFor="firstName">First Name</label>
                      <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="input-wrapper">
                      <label htmlFor="lastName">Last Name</label>
                      <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="dropdown-actions">
                      <button type="button" className="edit-button" onClick={handleSaveName} disabled={loading}>
                        {loading ? MESSAGES.SAVING : BUTTONS.SAVE}
                      </button>
                      <button type="button" className="edit-button cancel" onClick={handleCancelEdit} disabled={loading}>
                        {BUTTONS.CANCEL}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Link className="main-nav-item" to={ROUTES.PROFILE}>
                <i className="fa fa-briefcase"></i>
                Profile
              </Link>
              <button className="main-nav-item unstyled-button" onClick={handleLogout}>
                <i className="fa fa-sign-out"></i>
                Sign Out
              </button>
            </>
          ) : (
            <Link className="main-nav-item" to={ROUTES.LOGIN}>
              <i className="fa fa-user-circle"></i>
              {BUTTONS.SIGN_IN}
            </Link>
          )}
        </div>
      </nav>
      <main className={`main ${isLoginPage ? 'bg-dark' : ''}`}>{children}</main>
      <footer className="footer">
        <p className="footer-text">{getCopyrightText()}</p>
      </footer>
    </div>
  );
}
