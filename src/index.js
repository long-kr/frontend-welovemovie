import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { ToastProvider } from './ui';
import './index.css';
import { QueryClient, QueryClientProvider } from 'react-query';

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
