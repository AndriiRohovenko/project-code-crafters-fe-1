import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';
import { useAppSelector } from '@/redux/hooks';
import { Icon } from '@/shared/ui/icon';

const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/?d=mp&s=200';

export const HeaderUserBar = () => {
  const user = useAppSelector((state) => state.user);
  const { openModal } = useModals();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    setIsOpen(false);
    openModal(MODAL_TYPES.LOG_OUT);
  };

  return (
    <div className="relative min-w-[122px]" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-dark-grey pr-3 md:pr-5"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <img
          src={user.avatar || DEFAULT_AVATAR}
          alt={user.name || 'User avatar'}
          className="h-8 w-8 rounded-full object-cover md:h-[50px] md:w-[50px]"
        />
        <span className="text-xs font-bold uppercase text-white">
          {user.name}
        </span>
        <Icon name={isOpen ? 'up' : 'down'} size={18} className="text-white" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-[12px] w-full rounded-[15px] border border-light-grey bg-black p-[14px] md:mt-[8px]">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="hover:text-white/80 block text-xs font-bold uppercase text-white"
          >
            Profile
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="hover:text-white/80 mt-[21px] flex items-center gap-[6px] text-xs font-bold uppercase text-white"
          >
            Log out
            <Icon name="arrow-up-right" size={18} className="text-white" />
          </button>
        </div>
      )}
    </div>
  );
};
