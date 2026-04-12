import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router';

import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { Layout } from '@/components/Layout/Layout';
import { LoadingSpinner } from '@/components/Loader/LoadingSpinner';
import { ToastProvider } from '@/components/Toast/ToastProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute';
import { ROUTES } from '@/constants';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { store, useAppSelector } from '@/store/store';
import '@/index.css';

const Home = lazy(() => import('@/pages/Home/Home').then((m) => ({ default: m.Home })));
const Register = lazy(() => import('@/pages/Register/Register').then((m) => ({ default: m.Register })));
const SignIn = lazy(() => import('@/pages/SignIn/SignIn').then((m) => ({ default: m.SignIn })));
const NotFound = lazy(() => import('@/pages/NotFound/NotFound').then((m) => ({ default: m.NotFound })));
const Profile = lazy(() => import('@/pages/Users/Profile/Profile').then((m) => ({ default: m.Profile })));
const Settings = lazy(() => import('@/pages/Users/Settings/Settings').then((m) => ({ default: m.Settings })));
const Transactions = lazy(() => import('@/pages/Users/Transactions/Transactions').then((m) => ({ default: m.Transactions })));

const AppRoutes = () => {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  useGetProfileQuery(undefined, { skip: !isAuthenticated || !token });

  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner size="lg" label="Loading page" />}>
        <Routes>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<SignIn />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route
            path={ROUTES.PROFILE}
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.SETTINGS}
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.TRANSACTIONS}
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
