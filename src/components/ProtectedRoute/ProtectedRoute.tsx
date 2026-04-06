import { ReactNode } from 'react';
import { Navigate } from 'react-router';

import { LoadingSpinner } from '@/components/Loader';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { ROUTES, MESSAGES } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { logoutUser } from '@/features/Auth/authThunks';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: user, isLoading, isError } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isError) {
    dispatch(logoutUser());
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isLoading || !user) {
    return <LoadingSpinner size="lg" label={MESSAGES.LOADING_PROFILE} />;
  }

  return <>{children}</>;
};
