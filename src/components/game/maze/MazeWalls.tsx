
import { Cell } from '@/types/game';

interface MazeWallsProps {
  maze: Cell[];
  cellSize: number;
  ctx: CanvasRenderingContext2D;
}

export const MazeWalls = ({ maze, cellSize, ctx }: MazeWallsProps) => {
  if (!maze || maze.length === 0) return;
  
  ctx.strokeStyle = "#00BFFF";
  ctx.lineWidth = 4;
  ctx.shadowColor = "rgba(0,191,255,0.5)";
  ctx.shadowBlur = 5;
  
  maze.forEach((cell) => {
    const x = cell.col * cellSize, y = cell.row * cellSize;
    
    if (cell.walls.top) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    if (cell.walls.right) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.walls.bottom) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    if (cell.walls.left) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
  });
  
  // Reset shadow after drawing walls
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
};
