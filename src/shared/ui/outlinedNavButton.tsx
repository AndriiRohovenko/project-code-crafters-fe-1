import React from 'react';
import { NavLink } from 'react-router-dom';

type Variant = 'dark' | 'white';

interface OutlineNavButtonProps {
  to: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  isShowBorder?: boolean;
}

export const OutlineNavButton = ({
  to,
  children,
  variant = 'dark',
  className = '',
  isShowBorder = false,
}: OutlineNavButtonProps) => {
  const base =
    'inline-flex items-center justify-center rounded-full font-bold uppercase transition-colors duration-300 ease-in-out';

  const sizes = 'p-2 text-xs';

  const colorBase = variant === 'dark' ? 'text-black' : 'text-white';

  const interactive =
    variant === 'dark'
      ? 'hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white'
      : 'hover:bg-white hover:text-black focus-visible:bg-white focus-visible:text-black';

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          base,
          sizes,
          colorBase,

          isActive || isShowBorder
            ? 'border border-light-grey'
            : 'border border-transparent',

          !isActive ? interactive : '',

          className,
        ].join(' ')
      }
    >
      {children}
    </NavLink>
  );
};
