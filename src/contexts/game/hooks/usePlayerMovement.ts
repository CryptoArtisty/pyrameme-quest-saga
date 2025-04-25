
import { useCallback, useEffect } from 'react';
import { PlayerPosition, Cell, GridCell } from '@/types/game';
import { GameStateType } from '../types';
import { useTreasureCollection } from './useTreasureCollection';
import { useExitCell } from './useExitCell';
import { usePlayerCellMovement } from './usePlayerCellMovement';
import { useWallChecker } from './useWallChecker';

interface UsePlayerMovementProps {
  gameState: GameStateType;
  player: PlayerPosition | null;
  maze: Cell[];
  gridCells: GridCell[][];
  treasures: any[];
  exitCell: { col: number; row: number } | null;
  setPlayer: (position: PlayerPosition | null) => void;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  setTreasures: (treasures: any[]) => void;
  handleGameOver: () => void;
  toast: any;
}

export const usePlayerMovement = ({
  gameState,
  player,
  maze,
  gridCells,
  treasures,
  exitCell,
  setPlayer,
  setGameState,
  setTreasures,
  handleGameOver,
  toast
}: UsePlayerMovementProps) => {
  const { collectTreasure } = useTreasureCollection({
    treasures,
    setTreasures,
    setGameState,
    toast
  });

  const { handleExitReached } = useExitCell({
    gameState,
    exitCell,
    setGameState,
    handleGameOver,
    toast
  });

  const { movePlayerToCell } = usePlayerCellMovement({
    gameState,
    player,
    gridCells,
    collectTreasure,
    handleExitReached,
    setGameState,
    setPlayer,
    toast
  });

  const { checkWall } = useWallChecker(maze);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.phase !== 'play' || !player) {
      console.log("Cannot move player: not in play phase or player is null");
      return;
    }

    console.log("Attempting to move player in direction:", direction, "from position:", player);
    
    let newCol = player.col;
    let newRow = player.row;

    switch (direction) {
      case 'up':
        newRow = Math.max(0, player.row - 1);
        break;
      case 'down':
        newRow = Math.min(14, player.row + 1);
        break;
      case 'left':
        newCol = Math.max(0, player.col - 1);
        break;
      case 'right':
        newCol = Math.min(14, player.col + 1);
        break;
    }

    if (newCol === player.col && newRow === player.row) {
      console.log("Already at edge, can't move in that direction");
      return;
    }
    
    console.log("Checking wall for direction:", direction);
    const canMove = checkWall(player.col, player.row, direction);
    console.log("Can move:", canMove);

    if (canMove) {
      console.log("Moving to new position:", newCol, newRow);
      movePlayerToCell(newCol, newRow);
    } else {
      console.log("Cannot move: wall in the way");
      toast({
        title: "Can't Move There",
        description: "There's a wall in the way!",
      });
    }
  }, [gameState.phase, player, checkWall, movePlayerToCell, toast]);

  useEffect(() => {
    if (gameState.phase !== 'play') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.phase !== 'play' || !player) return;

      console.log("Key pressed:", e.key);
      
      switch (e.key) {
        case 'ArrowUp':
          movePlayer('up');
          break;
        case 'ArrowDown':
          movePlayer('down');
          break;
        case 'ArrowLeft':
          movePlayer('left');
          break;
        case 'ArrowRight':
          movePlayer('right');
          break;
      }
    };

    console.log("Adding keyboard event listener");
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      console.log("Removing keyboard event listener");
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState.phase, player, movePlayer]);

  return { movePlayer, movePlayerToCell };
};
