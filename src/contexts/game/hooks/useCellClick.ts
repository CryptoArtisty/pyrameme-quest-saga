
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
  const checkWall = (fromCell: Cell, toCol: number, toRow: number): boolean => {
    if (toCol > fromCell.col) return !fromCell.walls.right;
    if (toCol < fromCell.col) return !fromCell.walls.left;
    if (toRow > fromCell.row) return !fromCell.walls.bottom;
    if (toRow < fromCell.row) return !fromCell.walls.top;
    return true;
  };

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
        
        if (!checkWall(currentCell, col, row)) {
          toast({
            title: "Can't Move There",
            description: "There's a wall in the way!",
          });
          return;
        }
        
        movePlayerToCell(col, row);
      }
    }
  }, [gameState, player, maze, gridCells, setClaimTarget, setActiveModal, movePlayerToCell, toast]);

  return { onCellClick };
};

