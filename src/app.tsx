import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from '@/redux/store';
import AppRouter from '@/router/router';

import { Modals } from './modals/modals';
import { ModalsProvider } from './modals/modals.provider';

export const App = () => {
  return (
    <ModalsProvider>
      <Provider store={store}>
        <BrowserRouter>
          <AppRouter />
          <Modals />
        </BrowserRouter>
      </Provider>
    </ModalsProvider>
  );
};
