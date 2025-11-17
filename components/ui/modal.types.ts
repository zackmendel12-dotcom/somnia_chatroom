export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  className?: string;
}

export interface ValidationState {
  isValid: boolean;
  message?: string;
}

export interface ModalSize {
  width: string;
  maxWidth: string;
}

export const MODAL_SIZES = {
  sm: {
    width: '100%',
    maxWidth: '28rem',
  },
  md: {
    width: '100%',
    maxWidth: '32rem',
  },
  lg: {
    width: '100%',
    maxWidth: '42rem',
  },
  xl: {
    width: '100%',
    maxWidth: '56rem',
  },
} as const;

export type ModalSizeKey = keyof typeof MODAL_SIZES;
