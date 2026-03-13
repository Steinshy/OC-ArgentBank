import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router';

import { AppRoutes } from '@/AppRoutes';
import { Layout } from '@/components/Layout/Layout';
import { store } from '@/store/store';
import '@/index.css';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <AppRoutes />
        </Layout>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
