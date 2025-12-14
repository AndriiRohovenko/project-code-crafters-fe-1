import React, { useCallback, useState } from 'react';

import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import { useScreenDimensions } from '@/shared/hooks/use-screen-dimensions.hook';
import { BaseModal } from '@/shared/ui/base-modal';
import { Button } from '@/shared/ui/button';

import { signOut } from './auth';

export const LogoutModal: React.FC = () => {
  const { closeModal } = useModals();
  const [isLoading, setIsLoading] = useState(false);
  const { isMobile } = useScreenDimensions();

  const handleClose = useCallback(() => {
    closeModal(MODAL_TYPES.LOG_OUT);
  }, [closeModal]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      signOut();
      handleClose();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BaseModal onClose={handleClose}>
      <h2 className="mb-4 text-center text-[28px] font-bold uppercase leading-tight text-black md:text-[32px]">
        {isMobile ? 'Log out' : 'Are you logging out?'}
      </h2>

      <p
        className={`mb-8 text-center ${isMobile ? 'text-light-grey' : 'text-dark-grey'}`}
      >
        You can always log back in at any time.
      </p>

      <div className="flex flex-col gap-4">
        <Button
          type="button"
          label={isLoading ? 'Logging out...' : 'Log out'}
          disabled={isLoading}
          onClick={handleLogout}
          className="h-[48px] w-full md:h-[56px]"
        />

        <Button
          type="button"
          variant="outline-grey"
          label="Cancel"
          onClick={handleClose}
          className="h-[48px] w-full md:h-[56px]"
        />
      </div>
    </BaseModal>
  );
};
