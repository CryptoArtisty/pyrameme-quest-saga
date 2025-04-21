
import { GameStateType } from '../types';
import { GridCell } from '@/types/game';

interface UseCellClaimProps {
  gameState: GameStateType;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  setGridCells: (cells: React.SetStateAction<GridCell[][]>) => void;
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
      
      // Check if the cell is on the edge of the grid
      const isEdge = row === 0 || row === 14 || col === 0 || col === 14;
      // Edge cells cost 20,000 gold, other cells cost 2,000 gold
      const cost = isEdge ? 20000 : 2000;
      
      if (gameState.walletBalance < cost) {
        toast({
          title: "Insufficient Funds",
          description: `You need ${cost} gold to claim this cell.`,
        });
        setActiveModal("buy");
        return false;
      }
      
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - cost,
        totalLoss: prev.totalLoss + cost,
        playerNickname: nickname,
        playerClaimed: true
      }));
      
      setGridCells(prevCells => {
        const newCells = [...prevCells];
        if (!newCells[row]) newCells[row] = [];
        newCells[row][col] = {
          owner: gameState.playerAccount || 'local-player',
          nickname: initials
        };
        return newCells;
      });
      
      setClaimTarget(null);
      setActiveModal(null);
      
      toast({
        title: "Cell Claimed!",
        description: `You've successfully claimed this cell for ${cost} gold.`,
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
