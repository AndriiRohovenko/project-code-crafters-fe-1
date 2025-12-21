import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

import { getAccessToken } from '@/api/bootstrap-fetch-client';
import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';

export const PrivateRouteGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = getAccessToken();
  const { openModal } = useModals();

  useEffect(() => {
    if (!token) {
      openModal(MODAL_TYPES.SIGN_IN);
    }
  }, [token, openModal]);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};