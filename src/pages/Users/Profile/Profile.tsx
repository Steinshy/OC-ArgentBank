import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';

import { LoadingSpinner } from '@/components/Loader/LoadingSpinner';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { buildTransactionsRoute, ROUTES, MESSAGES, NAVIGATION, USE_MOCK } from '@/constants';
import { MOCK_ACCOUNTS } from '@/mocks/accounts';
import { logoutUser } from '@/features/Auth/authThunks';
import type { AppDispatch } from '@/store/store';
import './styles/Profile.css';

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { data: user, isLoading, isError } = useGetProfileQuery();

  if (isError) {
    dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
    return null;
  }

  if (isLoading || !user) {
    return <LoadingSpinner size="lg" label={MESSAGES.LOADING_PROFILE} />;
  }

  return (
    <>
      <div className="header">
        <h1>
          Welcome back {user.firstName} {user.lastName}!
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
              className="transaction-button"
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
  );
};
