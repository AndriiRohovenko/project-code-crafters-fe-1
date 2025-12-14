import { useMemo } from 'react';

import { NavigationModal } from '@/shared/widgets/header/header-mobile-nav-modal';
import { SignInModal } from '@/shared/widgets/header/header-sign-in-modal';
import { SignUpModal } from '@/shared/widgets/header/header-sign-up-modal';

import { MODAL_TYPES } from './modals.const';
import { useModals } from './use-modals.hook';

export const Modals = () => {
  const { modals } = useModals();

  const shouldShowNavigationModal = useMemo(
    () => modals.includes(MODAL_TYPES.NAVIGATION),
    [modals]
  );

  const shouldShowSignInModal = useMemo(
    () => modals.includes(MODAL_TYPES.SIGN_IN),
    [modals]
  );

  const shouldShowSignUpModal = useMemo(
    () => modals.includes(MODAL_TYPES.SIGN_UP),
    [modals]
  );

  return (
    <div>
      {shouldShowNavigationModal && <NavigationModal />}
      {shouldShowSignInModal && <SignInModal />}
      {shouldShowSignUpModal && <SignUpModal />}
    </div>
  );
};
