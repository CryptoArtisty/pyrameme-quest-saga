
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
  const checkWall = (fromCol: number, fromRow: number, toCol: number, toRow: number): boolean => {
    console.log("Checking wall between", {fromCol, fromRow}, "and", {toCol, toRow});
    
    const fromCell = maze.find(cell => cell.col === fromCol && cell.row === fromRow);
    if (!fromCell) {
      console.log("Source cell not found in maze");
      return false;
    }
    
    if (toCol > fromCol) return !fromCell.walls.right;
    if (toCol < fromCol) return !fromCell.walls.left;
    if (toRow > fromRow) return !fromCell.walls.bottom;
    if (toRow < fromRow) return !fromCell.walls.top;
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
      const isClaimed = gridCells[row]?.[col]?.owner !== null;
      if (isClaimed) {
        toast({
          title: "Cell Already Claimed",
          description: "This cell is already owned by someone.",
        });
        return;
      }
      
      setClaimTarget({col, row});
      setActiveModal("claim");
    } else if (gameState.phase === 'play' && player) {
      console.log("In play phase, checking if player can move to clicked cell", player);
      
      // Check if the clicked cell is adjacent to the player
      const dx = Math.abs(col - player.col);
      const dy = Math.abs(row - player.row);
      console.log("Distance check - dx:", dx, "dy:", dy);
      
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        console.log("Cell is adjacent, checking for walls");
        
        const canMove = checkWall(player.col, player.row, col, row);
        console.log("Can move:", canMove);
        
        if (!canMove) {
          console.log("Wall detected, cannot move");
          toast({
            title: "Can't Move There",
            description: "There's a wall in the way!",
          });
          return;
        }
        
        console.log("No wall detected, moving player to:", col, row);
        movePlayerToCell(col, row);
      } else {
        console.log("Cell is not adjacent to player");
        toast({
          title: "Invalid Move",
          description: "You can only move to adjacent cells.",
        });
      }
    }
  }, [gameState, player, maze, gridCells, setClaimTarget, setActiveModal, movePlayerToCell, toast]);

  return { onCellClick };
};
