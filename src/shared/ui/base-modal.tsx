import React, { useCallback, useEffect } from 'react';

import { Icon } from './icon';

interface BaseModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const BaseModal: React.FC<BaseModalProps> = ({ onClose, children }) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-[rgba(0,0,0,0.7)]"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[560px] rounded-[30px] bg-white px-[30px] pb-[60px] pt-12 md:p-[80px]">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 text-black transition-opacity hover:opacity-70"
          aria-label="Close modal"
        >
          <Icon name="close" size={24} />
        </button>

        {children}
      </div>
    </div>
  );
};
