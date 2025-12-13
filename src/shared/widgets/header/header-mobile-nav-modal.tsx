import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';

import LogoIcon from '@/assets/icons/logo.svg?react';
import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import { Icon } from '@/shared/ui/icon';

const LOGO_SIZE = 69;

export const NavigationModal: React.FC = () => {
  const { closeModal } = useModals();

  const close = useCallback(() => {
    closeModal(MODAL_TYPES.NAVIGATION);
  }, [closeModal]);

  return (
    <div className="fixed inset-0 z-[1000] bg-black text-white">
      <div className="relative mx-auto flex h-full w-full max-w-[480px] flex-col px-4 pb-10 pt-6">
        <div className="flex items-center justify-between">
          <LogoIcon width={LOGO_SIZE} />

          <button type="button" onClick={close}>
            <Icon name="close" size={28} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-6 pt-[70px] text-center">
          <NavLink
            to="/"
            end
            onClick={close}
            className={({ isActive }) =>
              [
                'text-sm font-bold uppercase',
                isActive
                  ? 'rounded-full border border-light-grey px-[34px] py-[14px] text-white'
                  : 'text-white/80',
              ].join(' ')
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/add-recipe"
            onClick={close}
            className={({ isActive }) =>
              [
                'text-sm font-bold uppercase',
                isActive
                  ? 'rounded-full border border-light-grey px-[34px] py-[14px] text-white'
                  : 'text-white/80',
              ].join(' ')
            }
          >
            Add recipe
          </NavLink>
        </nav>

        <div className="flex flex-1 items-center justify-center">
          <div className="">
            <img
              src="/images/hero/hero-dish-2-1x.png"
              alt="Dessert"
              width={97}
              className="mt-[80px] inline-block"
            />

            <img
              src="/images/hero/hero-dish-1x.png"
              alt="Featured dish"
              width={240}
              className="inline-block"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
