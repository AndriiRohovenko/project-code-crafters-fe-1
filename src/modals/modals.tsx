import { useMemo } from 'react';

import { NavigationModal } from '@/shared/widgets/header/header-mobile-nav-modal';

import { MODAL_TYPES } from './modals.const';
import { useModals } from './use-modals.hook';

export const Modals = () => {
  const { modals } = useModals();

  const shouldShowNavigationModal = useMemo(
    () => modals.includes(MODAL_TYPES.NAVIGATION),
    [modals]
  );

  return <div>{shouldShowNavigationModal && <NavigationModal />}</div>;
};
