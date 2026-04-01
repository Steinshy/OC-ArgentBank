import { ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

import { ROUTES } from '@/constants';
import { RootState } from '@/store/store';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
}
