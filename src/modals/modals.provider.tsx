import { type ReactNode, useCallback, useMemo, useState } from 'react';

import { ModalsContext } from './modals.context';
import { ModalsContextType, ModalType } from './modals.types';

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalType[]>([]);

  const openModal = useCallback((modalType: ModalType) => {
    setModals((prev) => [...prev, modalType]);
  }, []);

  const closeModal = useCallback((modalType: ModalType) => {
    setModals((prev) => {
      if (prev.length === 0) return prev;
      return prev.filter((m) => m !== modalType);
    });
  }, []);

  const closeAll = useCallback(() => setModals([]), []);

  const value = useMemo<ModalsContextType>(
    () => ({ modals, openModal, closeModal, closeAll }),
    [modals, openModal, closeModal, closeAll]
  );

  return (
    <ModalsContext.Provider value={value}>{children}</ModalsContext.Provider>
  );
};
