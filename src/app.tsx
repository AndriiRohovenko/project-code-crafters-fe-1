import 'react-toastify/dist/ReactToastify.css';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import { refreshUser } from '@/features/auth/auth';
import { store } from '@/redux/store';
import AppRouter from '@/router/router';

import { Modals } from './modals/modals';
import { ModalsProvider } from './modals/modals.provider';

export const App = () => {
  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <ModalsProvider>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
          <Modals />
          <ToastContainer />
        </BrowserRouter>
      </Provider>
    </ModalsProvider>
  );
};
