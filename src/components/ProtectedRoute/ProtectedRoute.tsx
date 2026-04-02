import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

import { LoadingSpinner } from '@/components/Loader';
import { ROUTES, MESSAGES } from '@/constants';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!user) {
    return <LoadingSpinner size="lg" label={MESSAGES.LOADING_PROFILE} />;
  }

  return <>{children}</>;
};
