import { useEffect } from 'react';
import { useNavigate } from 'react-router';

import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { useAuth } from '@/hooks/useAuth';
import { useMinimumLoadingDelay } from '@/hooks/useMinimumLoadingDelay';
import { ROUTES, buildTransactionsRoute } from '@/constants';
import { STATIC_ACCOUNTS } from '@/pages/Users/Transactions/staticAccounts';
import './styles/Profile.css';

export const Profile = () => {
  const navigate = useNavigate();
  const { user, isProfileLoading, isProfileError, logout } = useAuth();
  const loadingAccounts = useMinimumLoadingDelay();

  useEffect(() => {
    if (isProfileError) {
      logout();
      navigate(ROUTES.LOGIN);
    }
  }, [isProfileError, logout, navigate]);

  if (isProfileError) {
    return null;
  }

  const isContentLoading = isProfileLoading || loadingAccounts;

  return (
    <div className="profile-page">
      {isContentLoading ? (
        <SkeletonLoader variant="card" height="80px" label="Loading profile header" />
      ) : (
        <div className="header">
          <h1>
            Welcome back {user?.firstName} {user?.lastName}!
          </h1>
        </div>
      )}

      {isContentLoading ? (
        <SkeletonLoader variant="account" count={3} label="Loading accounts" />
      ) : (
        <>
          <h2 className="sr-only">Accounts</h2>

          {STATIC_ACCOUNTS.map((account) => (
            <section key={account.id} className="account">
              <div className="account-content-wrapper">
                <h3 className="account-title">{account.title}</h3>
                <p className="account-amount">${account.amount.toFixed(2)}</p>
                <p className="account-amount-description">{account.description}</p>
              </div>
              <div className="account-content-wrapper cta">
                <button className="btn btn-primary transaction-button" onClick={() => navigate(buildTransactionsRoute(account.id))}>
                  View Transactions
                </button>
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
};
