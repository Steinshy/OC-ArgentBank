import { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ROUTES } from '@/constants';
import { fetchUserProfile } from '@/features/Auth/authThunks';
import { Home } from '@/pages/Home/Home';
import { SignIn } from '@/pages/SignIn/SignIn';
import { NotFound } from '@/pages/NotFound/NotFound';
import { Profile } from '@/pages/Users/Profile/Profile';
import { Settings } from '@/pages/Users/Settings/Settings';
import { Transactions } from '@/pages/Users/Transactions/Transactions';
import { AppDispatch, RootState, store } from '@/store/store';
import '@/index.css';

const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(fetchUserProfile(token));
    }
  }, [dispatch, token, user]);

  return (
    <Layout>
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.LOGIN} element={<SignIn />} />
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
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;
