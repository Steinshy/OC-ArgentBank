import { ReactNode, useEffect } from 'react';
import { Navigate } from 'react-router';

import { LoadingSpinner } from '@/components/Loader/LoadingSpinner';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { ROUTES, MESSAGES } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectIsAuthenticated, selectAuthToken } from '@/store/selectors';
import { logoutUser } from '@/features/Auth/authThunks';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const token = useAppSelector(selectAuthToken);
  const { data: user, isLoading, isError } = useGetProfileQuery(undefined, { skip: !isAuthenticated || !token });

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
