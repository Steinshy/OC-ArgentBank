import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router';

import { ErrorBoundary } from '@/components/ErrorBoundary/ErrorBoundary';
import { Layout } from '@/components/Layout/Layout';
import { ToastProvider } from '@/components/Toast/ToastProvider';
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute';
import { ROUTES } from '@/constants';
import { useGetProfileQuery } from '@/api/argentBankApi';
import { Home } from '@/pages/Home/Home';
import { Register } from '@/pages/Register/Register';
import { SignIn } from '@/pages/SignIn/SignIn';
import { NotFound } from '@/pages/NotFound/NotFound';
import { Profile } from '@/pages/Users/Profile/Profile';
import { Settings } from '@/pages/Users/Settings/Settings';
import { Transactions } from '@/pages/Users/Transactions/Transactions';
import { store, useAppSelector } from '@/store/store';
import '@/index.css';

const AppRoutes = () => {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);
  useGetProfileQuery(undefined, { skip: !isAuthenticated || !token });

  return (
    <Layout>
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
