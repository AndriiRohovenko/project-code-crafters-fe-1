import { MODAL_TYPES } from '@/modals/modals.const';
import { useModals } from '@/modals/use-modals.hook';

export const HeaderAuthBar = () => {
  const { openModal } = useModals();

  const baseButtonClasses =
    'rounded-full border px-4 py-[10px] text-xs font-bold md:px-[28px] md:py-[14px]';

  return (
    <div className="inline-flex rounded-full bg-white p-[2px]">
      <button
        type="button"
        onClick={() => openModal(MODAL_TYPES.SIGN_IN)}
        className={`${baseButtonClasses} border-transparent bg-transparent text-black`}
      >
        SIGN IN
      </button>
      <button
        type="button"
        onClick={() => openModal(MODAL_TYPES.SIGN_UP)}
        className={`${baseButtonClasses} border-light-grey bg-black text-white`}
      >
        SIGN UP
      </button>
    </div>
  );
};
