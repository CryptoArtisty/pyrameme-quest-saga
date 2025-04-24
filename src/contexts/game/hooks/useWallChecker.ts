
import { useCallback } from 'react';
import { Cell } from '@/types/game';

export const useWallChecker = (maze: Cell[]) => {
  const getCellFromMaze = useCallback((col: number, row: number) => {
    return maze.find(cell => cell.col === col && cell.row === row);
  }, [maze]);

  const checkWall = useCallback((fromCol: number, fromRow: number, direction: 'up' | 'down' | 'left' | 'right'): boolean => {
    console.log(`Checking for wall from (${fromCol}, ${fromRow}) in direction: ${direction}`);
    
    const fromCell = getCellFromMaze(fromCol, fromRow);
    if (!fromCell) {
      console.log("Source cell not found in maze");
      return false;
    }
    
    switch (direction) {
      case 'up': return !fromCell.walls.top;
      case 'right': return !fromCell.walls.right;
      case 'down': return !fromCell.walls.bottom;
      case 'left': return !fromCell.walls.left;
      default: return false;
    }
  }, [getCellFromMaze]);

  return { checkWall };
};
