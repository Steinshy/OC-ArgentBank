import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { buildTransactionsRoute, ROUTES, NAVIGATION, USE_MOCK } from '@/constants';
import { MOCK_ACCOUNTS } from '@/mocks/accounts';
import { logoutUser } from '@/features/Auth/authThunks';
import type { AppDispatch, RootState } from '@/store/store';
import './styles/Profile.css';

export const Profile = () => {
  useDocumentTitle('Profile');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const { data: user, isLoading, isError, refetch } = useGetProfileQuery(undefined, { skip: !token });

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  if (isError) {
    dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
    return null;
  }

  return (
    <>
      {isLoading && !user ? (
        <>
          <div className="header">
            <div style={{ height: '3rem', width: '60%' }} className="skeleton" />
          </div>
          <h2 className="sr-only">Accounts</h2>
          <SkeletonLoader variant="account" count={MOCK_ACCOUNTS.length} label="Loading accounts" />
        </>
      ) : (
        <>
          <div className="header">
            <h1>
              Welcome back {user?.firstName} {user?.lastName}!
            </h1>
          </div>

          <h2 className="sr-only">Accounts</h2>
          {MOCK_ACCOUNTS.map((account) => (
            <section key={account.id} className="account">
              <div className="account-content-wrapper">
                <h3 className="account-title">{account.title}</h3>
                <p className="account-amount">${account.amount.toFixed(2)}</p>
                <p className="account-amount-description">{account.description}</p>
              </div>
              <div className="account-content-wrapper cta">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(buildTransactionsRoute(account.id))}
                  disabled={!USE_MOCK}
                  title={!USE_MOCK ? 'Transactions API not yet implemented' : undefined}
                >
                  {NAVIGATION.VIEW_TRANSACTIONS}
                </button>
              </div>
            </section>
          ))}
        </>
      )}
    </>
  );
};
