import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { getAccessToken } from '@/api/bootstrap-fetch-client';
import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import Loader from '@/shared/ui/loader';

export const PrivateRouteGuard = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const token = getAccessToken();
  const { openModal } = useModals();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Add a small delay to allow auth state to settle
    const timer = setTimeout(() => {
      setIsReady(true);
      if (!token) {
        openModal(MODAL_TYPES.SIGN_IN);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [token, openModal]);

  // Show loading while we wait for auth state to be ready
  if (!isReady) {
    return <Loader />;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};
