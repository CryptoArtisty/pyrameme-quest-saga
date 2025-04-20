
import { useCallback, useEffect } from 'react';
import { Cell, PlayerPosition, GridCell, Treasure } from '@/types/game';
import { GameStateType } from '../types';

interface UsePlayerMovementProps {
  gameState: GameStateType;
  player: PlayerPosition | null;
  maze: Cell[];
  gridCells: GridCell[][];
  treasures: Treasure[];
  exitCell: { col: number; row: number } | null;
  setPlayer: (position: PlayerPosition | null) => void;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  setTreasures: (treasures: Treasure[]) => void;
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
  const movePlayerToCell = useCallback((col: number, row: number) => {
    const cell = gridCells[row][col];
    if (cell.owner && cell.owner !== gameState.playerAccount) {
      if (gameState.walletBalance < 5) {
        toast({
          title: "Insufficient Funds",
          description: "You need 5 Pgl to park on someone else's cell.",
        });
        return;
      }
      
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - 5,
        totalLoss: prev.totalLoss + 5
      }));
      
      toast({
        title: "Parking Fee Paid",
        description: `You paid 5 Pgl to ${cell.nickname}.`,
      });
    }
    
    const treasure = treasures.find(t => t.col === col && t.row === row && !t.collected);
    if (treasure) {
      setTreasures(prev => prev.map(t => 
        t.col === col && t.row === row ? { ...t, collected: true } : t
      ));
      
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance + treasure.value,
        score: prev.score + treasure.value,
        totalProfit: prev.totalProfit + treasure.value
      }));
      
      toast({
        title: "Treasure Found!",
        description: `You found ${treasure.value} Pgl!`,
      });
    }
    
    if (exitCell && col === exitCell.col && row === exitCell.row) {
      const timeBonus = Math.floor(gameState.timeRemaining * 0.5);
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + timeBonus,
        totalProfit: prev.totalProfit + timeBonus
      }));
      
      toast({
        title: "Exit Reached!",
        description: `Time bonus: ${timeBonus} points!`,
      });
      
      handleGameOver();
      return;
    }
    
    setPlayer({ col, row });
  }, [gameState, gridCells, treasures, exitCell, setGameState, setTreasures, setPlayer, handleGameOver, toast]);

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

