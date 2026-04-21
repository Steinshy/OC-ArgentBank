import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { ROUTES, buildTransactionsRoute } from '@/constants';
import { logoutUser } from '@/features/Auth/authThunks';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectAuthToken } from '@/store/selectors';
import { STATIC_ACCOUNTS } from '@/pages/Users/Transactions/staticAccounts';
import './styles/Profile.css';

export const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(selectAuthToken);
  const { data: user, isLoading, isError, refetch } = useGetProfileQuery(undefined, { skip: !token });
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  useEffect(() => {
    const timer = setTimeout(() => setLoadingAccounts(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isError) {
    void dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
    return null;
  }

  const isContentLoading = isLoading || loadingAccounts;

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
