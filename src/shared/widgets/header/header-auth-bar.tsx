import { useState } from 'react';

import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';

type Mode = 'signIn' | 'signUp';

interface HeaderAuthBarProps {
  className?: string;
}

export const HeaderAuthBar = ({ className = '' }: HeaderAuthBarProps) => {
  const { openModal } = useModals();

  const [selected, setSelected] = useState<Mode>('signIn');
  const [hovered, setHovered] = useState<Mode | null>(null);

  const active = hovered ?? selected;

  const onClick = (mode: Mode) => {
    setSelected(mode);
    openModal(mode === 'signIn' ? MODAL_TYPES.SIGN_IN : MODAL_TYPES.SIGN_UP);
  };

  const wrapper = [
    'relative flex md:h-[46px] md:w-[208px]  h-[38px]  w-[156px] overflow-hidden rounded-[30px] bg-white',
    'ring-1 ring-black/15',
    className,
  ].join(' ');

  const indicatorBase =
    'absolute top-[0px] bottom-[0px] w-[calc(50%-1px)] rounded-[28px] bg-dark-grey border border-light-grey transition-transform duration-300 ease-in-out';

  const indicatorPos =
    active === 'signIn' ? 'translate-x-[0px]' : 'translate-x-[calc(100%+2px)]';

  const btnBase =
    'relative z-10 flex-1 rounded-[30px] font-semibold uppercase transition-colors duration-300 ease-in-out';

  const getBtnClass = (mode: Mode) =>
    [
      btnBase,
      'text-[12px] md:text-[12px]',
      mode === active ? 'text-white' : 'text-black',
      'bg-transparent',
    ].join(' ');

  return (
    <div className={wrapper} onMouseLeave={() => setHovered(null)}>
      <span className={`${indicatorBase} ${indicatorPos}`} />

      <button
        type="button"
        className={getBtnClass('signIn')}
        onMouseEnter={() => setHovered('signIn')}
        onFocus={() => setHovered('signIn')}
        onClick={() => onClick('signIn')}
      >
        SIGN IN
      </button>

      <button
        type="button"
        className={getBtnClass('signUp')}
        onMouseEnter={() => setHovered('signUp')}
        onFocus={() => setHovered('signUp')}
        onClick={() => onClick('signUp')}
      >
        SIGN UP
      </button>
    </div>
  );
};
