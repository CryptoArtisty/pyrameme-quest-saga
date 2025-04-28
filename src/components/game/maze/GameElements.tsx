
import { Treasure, PlayerPosition } from '@/types/game';

interface GameElementsProps {
  treasures: Treasure[];
  exitCell: { col: number; row: number } | null;
  player: PlayerPosition | null;
  cellSize: number;
  ctx: CanvasRenderingContext2D;
  hintPaths: number[][];
}

export const GameElements = ({ treasures, exitCell, player, cellSize, ctx, hintPaths }: GameElementsProps) => {
  // Draw hint paths
  if (hintPaths.length > 0) {
    ctx.fillStyle = "rgba(0,255,255,0.3)";
    hintPaths.forEach(([col, row]) => {
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    });
  }

  // Draw treasures
  if (treasures) {
    treasures.forEach((t) => {
      if (!t.collected) {
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(
          t.col * cellSize + cellSize / 2,
          t.row * cellSize + cellSize / 2,
          cellSize * 0.2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    });
  }

  // Draw exit
  if (exitCell) {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(
      exitCell.col * cellSize + cellSize / 2,
      exitCell.row * cellSize + cellSize / 2,
      cellSize * 0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Draw player
  if (player) {
    // FIXED: Added more detailed logging to troubleshoot player rendering
    console.log("Drawing player at:", player);
    
    const hasClaimedCurrently = player.hasClaimed !== undefined ? player.hasClaimed : false;
    const hasClaimedEver = player.hasClaimedEver !== undefined ? player.hasClaimedEver : true;
    
    // DEBUG: Always draw the player regardless of claim status for better debugging
    // if (!hasClaimedEver) return;
    
    ctx.shadowColor = "rgba(255,0,0,0.6)";
    ctx.shadowBlur = 10;
    
    // Enhanced visual distinction between claimed/unclaimed state
    ctx.fillStyle = hasClaimedCurrently ? "#ea384c" : "#8E9196";
    
    ctx.beginPath();
    ctx.arc(
      player.col * cellSize + cellSize / 2,
      player.row * cellSize + cellSize / 2,
      cellSize * 0.3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  } else {
    console.log("Player is null, not drawing");
  }
};
