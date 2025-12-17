import React from 'react';

interface PageButtonProps {
  label: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const PageButton: React.FC<PageButtonProps> = ({
  label,
  isActive,
  onClick,
}) => {
  return (
    <button
      type="button"
      aria-current={isActive ? 'page' : undefined}
      onClick={isActive ? undefined : onClick}
      className={[
        // layout
        'inline-flex h-10 w-10 items-center justify-center rounded-full bg-white',
        // typography
        'text-[14px] font-normal leading-[143%] tracking-[0.17px]',
        // interaction
        isActive ? 'cursor-default' : 'cursor-pointer',
        'transition-colors focus:outline-none',

        // HOVER + FOCUS (all devices одинаково по макету)
        !isActive
          ? 'hover:border-transparent hover:bg-black hover:text-white focus:border-transparent focus:bg-black focus:text-white'
          : '',

        // BORDER + TEXT COLORS (by device + active state)
        isActive
          ? [
              // mobile: active border black
              'border border-black text-dark-grey',
              // tablet: active border black
              'md:border-black md:text-dark-grey',
              // desktop: active border light-grey
              '2xl:border-light-grey 2xl:text-dark-grey',
            ].join(' ')
          : [
              // mobile: inactive border light-grey
              'border border-light-grey text-black',
              // tablet: inactive border transparent
              'md:border-transparent md:text-black',
              // desktop: inactive border transparent
              '2xl:border-transparent 2xl:text-black',
            ].join(' '),
      ].join(' ')}
    >
      {label}
    </button>
  );
};
