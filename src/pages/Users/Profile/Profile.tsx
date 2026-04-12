import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useGetProfileQuery, useGetAccountsQuery } from '@/api/argentBankApi';
import { buildTransactionsRoute, ROUTES, NAVIGATION } from '@/constants';
import { logoutUser } from '@/features/Auth/authThunks';
import type { AppDispatch, RootState } from '@/store/store';
import './styles/Profile.css';

export const Profile = () => {
  useDocumentTitle('Profile');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { token } = useSelector((state: RootState) => state.auth);
  const { data: user, isLoading: isProfileLoading, isError: isProfileError, refetch } = useGetProfileQuery(undefined, { skip: !token });
  const { data: accounts = [], isLoading: isAccountsLoading, isError: isAccountsError } = useGetAccountsQuery(undefined, { skip: !token });

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  useEffect(() => {
    if (isProfileError) {
      void dispatch(logoutUser());
      navigate(ROUTES.LOGIN);
    }
  }, [isProfileError, dispatch, navigate]);

  if (isProfileError) {
    return null;
  }

  const showProfileSkeleton = isProfileLoading && !user;
  const showAccountsSkeleton = isAccountsLoading && accounts.length === 0;

  return (
    <>
      {showProfileSkeleton ? (
        <div className="header">
          <div style={{ height: '3rem', width: '60%' }} className="skeleton" />
        </div>
      ) : (
        <div className="header">
          <h1>
            Welcome back {user?.firstName} {user?.lastName}!
          </h1>
        </div>
      )}

      <h2 className="sr-only">Accounts</h2>

      {showAccountsSkeleton ? (
        <SkeletonLoader variant="account" count={3} label="Loading accounts" />
      ) : isAccountsError ? (
        <p className="transaction-error" role="alert">
          Unable to load your accounts. Please try again later.
        </p>
      ) : (
        accounts.map((account) => (
          <section key={account.id} className="account">
            <div className="account-content-wrapper">
              <h3 className="account-title">{account.title}</h3>
              <p className="account-amount">${account.amount.toFixed(2)}</p>
              <p className="account-amount-description">{account.description}</p>
            </div>
            <div className="account-content-wrapper cta">
              <button className="btn btn-primary" onClick={() => navigate(buildTransactionsRoute(account.id))}>
                {NAVIGATION.VIEW_TRANSACTIONS}
              </button>
            </div>
          </section>
        ))
      )}
    </>
  );
};
