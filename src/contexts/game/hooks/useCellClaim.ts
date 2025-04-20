
import { GameStateType } from '../types';
import { GridCell } from '@/types/game';

interface UseCellClaimProps {
  gameState: GameStateType;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  setGridCells: (cells: GridCell[][]) => void;
  setClaimTarget: (target: { col: number; row: number } | null) => void;
  setActiveModal: (modal: string | null) => void;
  toast: any;
}

export const useCellClaim = ({
  gameState,
  setGameState,
  setGridCells,
  setClaimTarget,
  setActiveModal,
  toast
}: UseCellClaimProps) => {
  const claimCell = async (nickname: string, initials: string): Promise<boolean> => {
    const target = gameState.claimTarget;
    if (!target) return false;
    
    try {
      const { col, row } = target;
      
      const isCorner = (row === 0 || row === 14) && (col === 0 || col === 14);
      const cost = isCorner ? 20 : 5;
      
      if (gameState.walletBalance < cost) {
        toast({
          title: "Insufficient Funds",
          description: `You need ${cost} Pgl to claim this cell.`,
        });
        return false;
      }
      
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - cost,
        totalLoss: prev.totalLoss + cost,
        playerNickname: nickname,
        playerClaimed: true
      }));
      
      setGridCells(prev => {
        const newGrid = [...prev];
        if (!newGrid[row]) newGrid[row] = [];
        newGrid[row][col] = {
          owner: gameState.playerAccount || 'local-player',
          nickname: initials
        };
        return newGrid;
      });
      
      setClaimTarget(null);
      setActiveModal(null);
      
      toast({
        title: "Cell Claimed!",
        description: `You've successfully claimed this cell for ${cost} Pgl.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Could not claim the cell.",
      });
      return false;
    }
  };

  return { claimCell };
};
