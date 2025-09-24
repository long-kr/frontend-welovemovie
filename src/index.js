import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ToastProvider } from './ui';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();
const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
