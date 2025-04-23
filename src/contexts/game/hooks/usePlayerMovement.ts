
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
  }, [gameState, gridCells, collectTreasure, handleExitReached, setGameState, setPlayer, toast]);

  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.phase !== 'play' || !player) return;

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

    if (newCol !== player.col || newRow !== player.row) {
      const currentCell = maze.find(cell => cell.col === player.col && cell.row === player.row);
      if (!currentCell) return;

      let canMove = true;
      if (direction === 'up' && currentCell.walls.top) canMove = false;
      if (direction === 'right' && currentCell.walls.right) canMove = false;
      if (direction === 'down' && currentCell.walls.bottom) canMove = false;
      if (direction === 'left' && currentCell.walls.left) canMove = false;

      if (canMove) {
        movePlayerToCell(newCol, newRow);
      }
    }
  }, [gameState.phase, player, maze, movePlayerToCell]);

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
