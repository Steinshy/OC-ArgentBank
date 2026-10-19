import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Navigate } from 'react-router';

import { useGetProfileQuery } from '@/api/argentBankApi';
import { LoadingSpinner } from '@/components/Loader/LoadingSpinner';
import { ROUTES, MESSAGES } from '@/constants';
import { logoutUser } from '@/features/Auth/authThunks';
import { selectIsAuthenticated } from '@/store/selectors';
import { useAppDispatch, useAppSelector } from '@/store/store';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: user, isLoading, isError } = useGetProfileQuery(undefined, { skip: !isAuthenticated });

  useEffect(() => {
    if (isError && isAuthenticated) {
      void dispatch(logoutUser());
    }
  }, [dispatch, isAuthenticated, isError]);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isError) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (isLoading || !user) {
    return <LoadingSpinner size="lg" label={MESSAGES.LOADING_PROFILE} />;
  }

  return <>{children}</>;
};
