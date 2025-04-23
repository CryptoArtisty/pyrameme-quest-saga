
import { useCallback } from 'react';
import { Cell, PlayerPosition, GridCell } from '@/types/game';
import { GameStateType } from '../types';

interface UseGameActionsProps {
  gameState: GameStateType;
  player: PlayerPosition | null;
  maze: Cell[];
  gridCells: GridCell[][];
  setClaimTarget: (target: { col: number; row: number } | null) => void;
  setActiveModal: (modal: string | null) => void;
  movePlayerToCell: (col: number, row: number) => void;
  toast: any;
}

export const useGameActions = ({
  gameState,
  player,
  maze,
  gridCells,
  setClaimTarget,
  setActiveModal,
  movePlayerToCell,
  toast
}: UseGameActionsProps) => {
  // Helper function to check if there's a wall between cells
  const checkWall = (fromCell: Cell, toCol: number, toRow: number): boolean => {
    console.log("Checking wall between", fromCell, "and", toCol, toRow);
    
    if (toCol > fromCell.col) return !fromCell.walls.right;
    if (toCol < fromCell.col) return !fromCell.walls.left;
    if (toRow > fromCell.row) return !fromCell.walls.bottom;
    if (toRow < fromCell.row) return !fromCell.walls.top;
    return true;
  };

  const onCellClick = useCallback((col: number, row: number) => {
    console.log("Cell clicked:", col, row, "Current phase:", gameState.phase);
    
    if (gameState.gameOver) {
      console.log("Game is over, ignoring click");
      return;
    }
    
    if (gameState.phase === 'claim') {
      console.log("In claim phase, checking if cell can be claimed");
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
          description: `You need ${cost} gold to claim this cell.`,
        });
        return;
      }
      
      setClaimTarget({col, row});
      setActiveModal("claim");
    } else if (gameState.phase === 'play' && player) {
      console.log("In play phase, checking if player can move to clicked cell");
      
      // Check if the clicked cell is adjacent to the player
      const dx = Math.abs(col - player.col);
      const dy = Math.abs(row - player.row);
      console.log("dx:", dx, "dy:", dy);
      
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        console.log("Cell is adjacent, checking for walls");
        const currentCell = maze.find(cell => cell.col === player.col && cell.row === player.row);
        if (!currentCell) {
          console.log("Current cell not found");
          return;
        }
        
        if (!checkWall(currentCell, col, row)) {
          console.log("Wall detected, cannot move");
          toast({
            title: "Can't Move There",
            description: "There's a wall in the way!",
          });
          return;
        }
        
        console.log("No wall detected, moving player");
        movePlayerToCell(col, row);
      } else {
        console.log("Cell is not adjacent to player");
      }
    }
  }, [gameState, player, maze, gridCells, setClaimTarget, setActiveModal, movePlayerToCell, checkWall, toast]);

  return { onCellClick };
};
