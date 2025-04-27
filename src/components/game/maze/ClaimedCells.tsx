
import { GridCell } from '@/types/game';

interface ClaimedCellsProps {
  gridCells: GridCell[][];
  cellSize: number;
  ctx: CanvasRenderingContext2D;
}

export const ClaimedCells = ({ gridCells, cellSize, ctx }: ClaimedCellsProps) => {
  if (!gridCells) return;
  
  for (let r = 0; r < gridCells.length; r++) {
    if (gridCells[r]) {
      for (let c = 0; c < gridCells[r].length; c++) {
        if (gridCells[r][c] && gridCells[r][c].owner) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
          ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
          ctx.font = `bold ${cellSize / 2}px sans-serif`;
          ctx.fillStyle = "#FFD700";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(gridCells[r][c].nickname || "✓", c * cellSize + cellSize / 2, r * cellSize + cellSize / 2);
        }
      }
    }
  }
};
