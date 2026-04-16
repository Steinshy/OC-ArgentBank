import { useEffect } from 'react';
import { Wallet } from 'lucide-react';
import { useNavigate } from 'react-router';

import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { ROUTES } from '@/constants';
import { logoutUser } from '@/features/Auth/authThunks';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectAuthToken } from '@/store/selectors';
import './styles/Profile.css';

export const Profile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const token = useAppSelector(selectAuthToken);
  const { data: user, isLoading, isError, refetch } = useGetProfileQuery(undefined, { skip: !token });

  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  if (isError) {
    void dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
    return null;
  }

  return (
    <div className="profile-page">
      {isLoading ? (
        <>
          <div className="header">
            <div style={{ height: '3rem', width: '60%' }} className="skeleton" />
          </div>
          <SkeletonLoader variant="account" count={3} label="Loading accounts" />
        </>
      ) : (
        <>
          <div className="header">
            <h1>
              Welcome back {user?.firstName} {user?.lastName}!
            </h1>
          </div>

          <section className="accounts-section" aria-labelledby="accounts-heading">
            <h2 id="accounts-heading" className="sr-only">
              Your Accounts
            </h2>
            <EmptyState icon={<Wallet strokeWidth={1.5} />} title="No accounts yet" description="Your accounts will appear here once you set them up." />
          </section>
        </>
      )}
    </div>
  );
};
