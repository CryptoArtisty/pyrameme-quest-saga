
import { useCellClick } from './useCellClick';
import { useMenuModal } from './useMenuModal';
import { Cell, PlayerPosition, GridCell } from '@/types/game';
import { GameStateType } from '../types';

interface UseGameMechanicsProps {
  gameState: GameStateType;
  player: PlayerPosition | null;
  maze: Cell[];
  gridCells: GridCell[][];
  setClaimTarget: (target: { col: number; row: number } | null) => void;
  setActiveModal: (modal: string | null) => void;
  movePlayerToCell: (col: number, row: number) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  toast: any;
}

export const useGameMechanics = ({
  gameState,
  player,
  maze,
  gridCells,
  setClaimTarget,
  setActiveModal,
  movePlayerToCell,
  isMenuOpen,
  setIsMenuOpen,
  toast
}: UseGameMechanicsProps) => {
  const { onCellClick } = useCellClick({
    gameState,
    player,
    maze,
    gridCells,
    setClaimTarget,
    setActiveModal,
    movePlayerToCell,
    toast
  });

  const { toggleMenu, showModal } = useMenuModal({
    isMenuOpen,
    setIsMenuOpen,
    setActiveModal
  });

  return {
    onCellClick,
    toggleMenu,
    showModal
  };
};
