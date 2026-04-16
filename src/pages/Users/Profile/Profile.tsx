import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';

import { SkeletonLoader } from '@/components/Loader/SkeletonLoader';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { ROUTES } from '@/constants';
import { logoutUser } from '@/features/Auth/authThunks';
import type { AppDispatch, RootState } from '@/store/store';
import './styles/Profile.css';

export const Profile = () => {
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
    void dispatch(logoutUser());
    navigate(ROUTES.LOGIN);
    return null;
  }

  return (
    <>
      {isLoading ? (
        <>
          <div className="header">
            <div style={{ height: '3rem', width: '60%' }} className="skeleton" />
          </div>
          <SkeletonLoader variant="account" count={3} label="Loading profile" />
        </>
      ) : (
        <div className="header">
          <h1>
            Welcome back {user?.firstName} {user?.lastName}!
          </h1>
        </div>
      )}
    </>
  );
};
