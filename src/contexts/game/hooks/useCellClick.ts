
import { useCallback } from 'react';
import { Cell, PlayerPosition, GridCell } from '@/types/game';
import { GameStateType } from '../types';

interface UseCellClickProps {
  gameState: GameStateType;
  player: PlayerPosition | null;
  maze: Cell[];
  gridCells: GridCell[][];
  setClaimTarget: (target: { col: number; row: number } | null) => void;
  setActiveModal: (modal: string | null) => void;
  movePlayerToCell: (col: number, row: number) => void;
  toast: any;
}

export const useCellClick = ({
  gameState,
  player,
  maze,
  gridCells,
  setClaimTarget,
  setActiveModal,
  movePlayerToCell,
  toast
}: UseCellClickProps) => {
  const onCellClick = useCallback((col: number, row: number) => {
    if (gameState.gameOver) return;
    
    if (gameState.phase === 'claim') {
      const isClaimed = gridCells[row][col].owner !== null;
      if (isClaimed) {
        toast({
          title: "Cell Already Claimed",
          description: "This cell is already owned by someone.",
        });
        return;
      }
      
      const isCorner = (row === 0 || row === 14) && (col === 0 || col === 14);
      const cost = isCorner ? 20 : 5;
      
      if (gameState.walletBalance < cost) {
        toast({
          title: "Insufficient Funds",
          description: `You need ${cost} Pgl to claim this cell.`,
        });
        return;
      }
      
      setClaimTarget({col, row});
      setActiveModal("claim");
    } else if (gameState.phase === 'play' && player) {
      const dx = Math.abs(col - player.col);
      const dy = Math.abs(row - player.row);
      
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        const currentCell = maze.find(cell => cell.col === player.col && cell.row === player.row);
        if (!currentCell) return;
        
        movePlayerToCell(col, row);
      }
    }
  }, [gameState, player, maze, gridCells, setClaimTarget, setActiveModal, movePlayerToCell, toast]);

  return { onCellClick };
};
