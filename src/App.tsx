import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router';

import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Layout } from '@/components/Layout/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ROUTES } from '@/constants';
import { Home } from '@/pages/Home/Home';
import { Login } from '@/pages/Login/Login';
import { NotFound } from '@/pages/NotFound/NotFound';
import { Profile } from '@/pages/Users/Profile/Profile';
import { Transactions } from '@/pages/Users/Transactions/Transactions';
import { store } from '@/store/store';
import '@/index.css';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <BrowserRouter basename={import.meta.env.BASE_URL}>
          <Layout>
            <Routes>
              <Route path={ROUTES.HOME} element={<Home />} />
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route
                path={ROUTES.PROFILE}
                element={
                  <ProtectedRoute>
                    <Profile />
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
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
