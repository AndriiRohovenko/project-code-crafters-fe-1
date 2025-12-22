import { Link, useLocation } from 'react-router-dom';

import LogoIcon from '@/assets/icons/logo.svg?react';
import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import { useAppSelector } from '@/redux/hooks';
import { useScreenDimensions } from '@/shared/hooks/use-screen-dimensions.hook';
import { Icon } from '@/shared/ui/icon';
import { OutlineNavButton } from '@/shared/ui/outlinedNavButton.tsx';

import { HeaderAuthBar } from './header-auth-bar';
import { HeaderUserBar } from './header-user-bar';

const SMALL_LOGO_SIZE = 69;
const LARGE_LOGO_SIZE = 83;

export const Header: React.FC = () => {
  const { isMobile } = useScreenDimensions();
  const { openModal } = useModals();
  const user = useAppSelector((state) => state.user);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  return (
    <header className="position-relative z-[100] pt-[24px] md:pt-9 2xl:pt-10">
      <div className="relative mx-auto flex max-w-[1280px] items-center justify-between px-5 md:px-8 2xl:px-0">
        <Link to="/" aria-label="Go to homepage">
          <LogoIcon
            width={isMobile ? SMALL_LOGO_SIZE : LARGE_LOGO_SIZE}
            className={isHomePage ? 'text-white' : 'text-black'}
          />
        </Link>

        {!isMobile && (
          <nav
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-6 md:flex"
            aria-label="Primary"
          >
            <OutlineNavButton
              variant={isHomePage ? 'white' : 'dark'}
              to={'/'}
              className="p-[12px] text-[12px]"
            >
              Home
            </OutlineNavButton>
            <OutlineNavButton
              to={'/add-recipe'}
              className="p-[12px] text-[12px]"
              variant={isHomePage ? 'white' : 'dark'}
            >
              Add recipe
            </OutlineNavButton>
          </nav>
        )}

        <div className="flex items-center gap-2">
          {user ? <HeaderUserBar /> : <HeaderAuthBar />}

          {isMobile && user && (
            <button
              type="button"
              aria-label="Open menu"
              className={isHomePage ? 'text-white' : 'text-black'}
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
