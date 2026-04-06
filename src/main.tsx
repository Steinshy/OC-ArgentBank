import React from 'react';
import ReactDOM from 'react-dom/client';
import { setupListeners } from '@reduxjs/toolkit/query';

import App from '@/App';
import { store } from '@/store/store';

setupListeners(store.dispatch);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
