import { useState } from 'react';

type ActiveAuthButton = 'signin' | 'signup';

export const HeaderAuthButtons = () => {
  const [activeButton, setActiveButton] = useState<ActiveAuthButton>('signin');

  const baseButtonClasses =
    'rounded-full border px-4 py-[10px] text-xs font-bold md:px-[28px] md:py-[14px]';
  const activeClasses = 'bg-black text-white border-light-grey';
  const inactiveClasses = 'bg-transparent text-black border-transparent';

  return (
    <div className="inline-flex rounded-full bg-white p-[2px]">
      <button
        type="button"
        aria-pressed={activeButton === 'signin'}
        onClick={() => setActiveButton('signin')}
        className={[
          baseButtonClasses,
          activeButton === 'signin' ? activeClasses : inactiveClasses,
        ].join(' ')}
      >
        SIGN IN
      </button>
      <button
        type="button"
        aria-pressed={activeButton === 'signup'}
        onClick={() => setActiveButton('signup')}
        className={[
          baseButtonClasses,
          activeButton === 'signup' ? activeClasses : inactiveClasses,
        ].join(' ')}
      >
        SIGN UP
      </button>
    </div>
  );
};
