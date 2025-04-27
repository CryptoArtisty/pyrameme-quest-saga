
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
    
    // Determine which wall we're checking based on movement direction
    if (toCol > fromCol) return !fromCell.walls.right;  // Moving right
    if (toCol < fromCol) return !fromCell.walls.left;   // Moving left
    if (toRow > fromRow) return !fromCell.walls.bottom; // Moving down
    if (toRow < fromRow) return !fromCell.walls.top;    // Moving up
    
    return true; // Same cell, no wall
  };

  const onCellClick = useCallback((col: number, row: number) => {
    console.log("Cell clicked:", col, row, "Current phase:", gameState.phase);
    
    if (gameState.gameOver) {
      toast({
        title: "Game Over",
        description: "Start a new round to continue playing.",
      });
      return;
    }
    
    if (gameState.phase === 'claim') {
      console.log("In claim phase, checking if cell can be claimed");
      
      // Make sure gridCells and the row exist
      if (!gridCells || !gridCells[row]) {
        toast({
          title: "System Error",
          description: "There was a problem with the game grid. Please try again.",
        });
        return;
      }
      
      // Check if the cell is already claimed
      const isClaimed = gridCells[row][col]?.owner !== undefined && gridCells[row][col]?.owner !== null;
      
      if (isClaimed) {
        toast({
          title: "Cell Already Claimed",
          description: "This cell is already owned by someone.",
        });
        return;
      }

      // Check if player has already claimed a cell in this round
      if (gameState.playerClaimed) {
        toast({
          title: "Already Claimed",
          description: "You've already claimed a cell in this round.",
        });
        return;
      }

      if (gameState.walletBalance < 2000) {
        toast({
          title: "Insufficient Gold",
          description: "You need at least 2,000 gold to claim a cell.",
        });
        return;
      }
      
      setClaimTarget({col, row});
      setActiveModal("claim");
      return;
    } 
    
    if (gameState.phase === 'play') {
      if (!player) {
        toast({
          title: "No Player Position",
          description: "You need to claim a cell first to play.",
        });
        return;
      }

      // Check if the clicked cell is adjacent to the player
      const dx = Math.abs(col - player.col);
      const dy = Math.abs(row - player.row);
      
      // Check if clicked cell is adjacent (one step horizontally OR vertically, not both)
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        // Check if there's a wall between the current and target cells
        const canMove = checkWall(player.col, player.row, col, row);
        
        if (!canMove) {
          toast({
            title: "Can't Move There",
            description: "There's a wall in the way!",
          });
          return;
        }
        
        movePlayerToCell(col, row);
      } else {
        toast({
          title: "Invalid Move",
          description: "You can only move to adjacent cells.",
        });
      }
    } else {
      toast({
        title: "Wrong Phase",
        description: `You can't perform this action during the ${gameState.phase} phase.`,
      });
    }
  }, [gameState, player, maze, gridCells, setClaimTarget, setActiveModal, movePlayerToCell, toast]);

  return { onCellClick };
};
