
import { useCallback, useEffect } from 'react';
import { Cell, PlayerPosition, GridCell } from '@/types/game';
import { GameStateType } from '../types';
import { useTreasureCollection } from './useTreasureCollection';
import { useExitCell } from './useExitCell';
import { processParking } from '@/lib/goldEconomy';

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

  const movePlayerToCell = useCallback((col: number, row: number) => {
    if (!player) return; // Safety check
    
    console.log("Moving player to cell:", col, row);
    const cell = gridCells[row][col];
    
    // Only charge parking fee if cell has an owner (any owner)
    if (cell.owner) {
      const isOwnCell = cell.owner === gameState.playerAccount;
      
      // Skip parking fee if player owns the cell
      if (!isOwnCell) {
        if (gameState.walletBalance < 1) {
          toast({
            title: "Insufficient Funds",
            description: "You need at least 1 gold to park on someone else's cell.",
          });
          return;
        }

        setGameState(prev => ({
          ...prev,
          walletBalance: prev.walletBalance - 1,
          totalLoss: prev.totalLoss + 1
        }));

        // Process the parking fee - send to cell owner or treasury
        processParking(1, cell.owner);

        toast({
          title: "Parking Fee Paid",
          description: `You paid 1 gold to ${cell.nickname || 'parking fee collector'}.`,
        });
      }
    }

    collectTreasure(col, row);
    handleExitReached(col, row);
    setPlayer({ col, row });
    
    console.log("Player position updated:", col, row);
  }, [gameState, player, gridCells, collectTreasure, handleExitReached, setGameState, setPlayer, toast]);

  // Helper function to get cell from maze
  const getCellFromMaze = useCallback((col: number, row: number) => {
    return maze.find(cell => cell.col === col && cell.row === row);
  }, [maze]);

  // Helper function to check wall
  const checkWall = useCallback((fromCell: Cell, direction: 'up' | 'down' | 'left' | 'right'): boolean => {
    switch (direction) {
      case 'up': return !fromCell.walls.top;
      case 'right': return !fromCell.walls.right;
      case 'down': return !fromCell.walls.bottom;
      case 'left': return !fromCell.walls.left;
      default: return false;
    }
  }, []);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.phase !== 'play' || !player) {
      console.log("Cannot move player: not in play phase or player is null");
      return;
    }

    console.log("Attempting to move player in direction:", direction);
    
    let newCol = player.col;
    let newRow = player.row;

    // Calculate new position based on direction
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

    // Check if new position is different from current position
    if (newCol !== player.col || newRow !== player.row) {
      const currentCell = getCellFromMaze(player.col, player.row);
      if (!currentCell) {
        console.log("Current cell not found in maze");
        return;
      }

      console.log("Checking wall for direction:", direction);
      const canMove = checkWall(currentCell, direction);
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
    }
  }, [gameState.phase, player, getCellFromMaze, checkWall, movePlayerToCell, toast]);

  useEffect(() => {
    if (gameState.phase !== 'play') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.phase !== 'play' || !player) return;

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

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase, player, movePlayer]);

  return { movePlayer, movePlayerToCell };
};
