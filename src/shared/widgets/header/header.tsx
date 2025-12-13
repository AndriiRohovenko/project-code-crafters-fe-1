import React from 'react';
import { Link, NavLink } from 'react-router-dom';

import LogoIcon from '@/assets/icons/logo.svg?react';
import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import { useScreenDimensions } from '@/shared/hooks/use-screen-dimensions.hook';
import { Icon } from '@/shared/ui/icon';

import { HeaderAuthButtons } from './header-auth-buttons';

const SMALL_LOGO_SIZE = 69;
const LARGE_LOGO_SIZE = 83;

export const Header: React.FC = () => {
  const { isMobile } = useScreenDimensions();
  const { openModal } = useModals();

  return (
    <header className="pt-[24px] md:pt-9 2xl:pt-10">
      <div className="relative mx-auto flex max-w-[1280px] items-center justify-between px-4 md:px-8 2xl:px-0">
        <Link to="/" aria-label="Go to homepage">
          <LogoIcon
            width={isMobile ? SMALL_LOGO_SIZE : LARGE_LOGO_SIZE}
            className="text-black"
          />
        </Link>

        {!isMobile && (
          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:flex"
            aria-label="Primary"
          >
            <NavLink
              to="/"
              className={({ isActive }) =>
                [
                  'rounded-full border p-[14px] text-xs font-bold uppercase',
                  isActive
                    ? 'border-light-grey text-black'
                    : 'text-black/70 border-transparent',
                ].join(' ')
              }
              end
            >
              Home
            </NavLink>

            <NavLink
              to="/add-recipe"
              className={({ isActive }) =>
                [
                  'rounded-full border p-[14px] text-xs font-bold uppercase',
                  isActive
                    ? 'border-light-grey text-black'
                    : 'text-black/70 border-transparent',
                ].join(' ')
              }
            >
              Add recipe
            </NavLink>
          </nav>
        )}

        <div className="flex items-center gap-2">
          <HeaderAuthButtons />

          {isMobile && (
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => openModal(MODAL_TYPES.NAVIGATION)}
            >
              <Icon name="burger" size={28} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
