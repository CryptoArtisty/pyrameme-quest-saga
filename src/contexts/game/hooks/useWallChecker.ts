
import { Cell } from '@/types/game';
import { useCallback } from 'react';

export const useWallChecker = (maze: Cell[]) => {
  const findCell = useCallback((col: number, row: number): Cell | undefined => {
    return maze.find(cell => cell.col === col && cell.row === row);
  }, [maze]);

  const checkWall = useCallback((fromCol: number, fromRow: number, direction: 'up' | 'down' | 'left' | 'right'): boolean => {
    const fromCell = findCell(fromCol, fromRow);
    if (!fromCell) {
      console.log("Source cell not found in maze at", fromCol, fromRow);
      return false;
    }

    console.log("Checking wall from", fromCol, fromRow, "direction:", direction);
    console.log("Cell walls:", fromCell.walls);

    // Check if there's a wall in the requested direction
    switch (direction) {
      case 'up':
        return !fromCell.walls.top;
      case 'right':
        return !fromCell.walls.right;
      case 'down':
        return !fromCell.walls.bottom;
      case 'left':
        return !fromCell.walls.left;
      default:
        return false;
    }
  }, [findCell]);

  return { checkWall, findCell };
};
