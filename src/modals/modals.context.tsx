import { createContext } from 'react';

import { ModalsContextType } from './modals.types';

export const ModalsContext = createContext<ModalsContextType>({
  modals: [],
  openModal: () => '',
  closeModal: () => {},
  closeAll: () => {},
});
