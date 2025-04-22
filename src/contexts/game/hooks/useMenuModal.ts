
import { useCallback } from 'react';

interface UseMenuModalProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  setActiveModal: (modal: string | null) => void;
}

export const useMenuModal = ({
  isMenuOpen,
  setIsMenuOpen,
  setActiveModal
}: UseMenuModalProps) => {
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen, setIsMenuOpen]);

  const showModal = useCallback((modalName: string | null) => {
    setActiveModal(modalName);
  }, [setActiveModal]);

  return {
    toggleMenu,
    showModal
  };
};
