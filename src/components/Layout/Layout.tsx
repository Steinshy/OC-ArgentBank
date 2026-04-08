import { ReactNode } from 'react';
import { CircleUser, LogOut, Settings } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router';

import { ROUTES, BUTTONS, NAVIGATION, getCopyrightText, getPublicAssetUrl } from '@/constants';
import { logoutUser } from '@/features/Auth/authThunks';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { useAppDispatch, useAppSelector } from '@/store/store';
import './styles/Layout.css';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: user } = useGetProfileQuery(undefined, { skip: !isAuthenticated });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthPage = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate(ROUTES.HOME);
  };

  return (
    <div className="layout">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <nav className="main-nav" aria-label="Main navigation">
        <Link className="main-nav-logo" to={ROUTES.HOME}>
          <img className="main-nav-logo-image" src={getPublicAssetUrl('assets/img/argentBankLogo-60x40.png')} alt={NAVIGATION.HOME_LOGO_ALT} />
          <h1 className="sr-only">Argent Bank</h1>
        </Link>
        <div className="main-nav-items">
          {isAuthenticated && user ? (
            <>
              <Link className="main-nav-user-cta" to={ROUTES.PROFILE}>
                <CircleUser className="main-nav-user-cta__icon" aria-hidden strokeWidth={2} />
                {user.firstName}
              </Link>
              <Link className="main-nav-user-cta" to={ROUTES.SETTINGS}>
                <Settings className="main-nav-user-cta__icon" aria-hidden strokeWidth={2} />
                Settings
              </Link>
              <button type="button" className="main-nav-user-cta main-nav-user-cta--logout" onClick={handleLogout}>
                <LogOut className="main-nav-user-cta__icon main-nav-user-cta__icon--danger" aria-hidden strokeWidth={2} />
                {BUTTONS.SIGN_OUT}
              </button>
            </>
          ) : (
            <div className="main-nav-auth">
              <Link className="main-nav-link-sign-in" to={ROUTES.LOGIN}>
                {BUTTONS.SIGN_IN}
              </Link>
              <Link className="main-nav-cta-pill" to={ROUTES.REGISTER}>
                {BUTTONS.REGISTER}
              </Link>
            </div>
          )}
        </div>
      </nav>
      <main id="main-content" className={`main ${isAuthPage ? 'bg-dark' : ''}`}>
        {children}
      </main>
      <footer className="footer">
        <p className="footer-text">{getCopyrightText()}</p>
      </footer>
    </div>
  );
};
