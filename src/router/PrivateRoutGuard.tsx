import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import { RootState } from '@/redux/store';

export const PrivateRouteGuard = () => {
  const user = useSelector((state: RootState) => state.user);
  const { openModal } = useModals();

  useEffect(() => {
    if (!user) {
      openModal(MODAL_TYPES.SIGN_IN);
    }
  }, [user, openModal]);

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
