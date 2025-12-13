import { MODAL_TYPES } from './modals.const';

export type ModalType = (typeof MODAL_TYPES)[keyof typeof MODAL_TYPES];

export type ModalsContextType = {
  modals: ModalType[];
  openModal: (modalType: ModalType) => void;
  closeModal: (modalType: ModalType) => void;
  closeAll: () => void;
};
