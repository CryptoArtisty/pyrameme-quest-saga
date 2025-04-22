import React, { useRef, useEffect } from 'react';
import { Cell, PlayerPosition, Treasure, GridCell } from '@/types/game';

interface MazeCanvasProps {
  maze: Cell[];
  player: PlayerPosition | null;
  treasures: Treasure[];
  exitCell: PlayerPosition | null;
  gridCells: GridCell[][];
  hintPaths: number[][]; 
  onCellClick: (col: number, row: number) => void;
}

const MazeCanvas: React.FC<MazeCanvasProps> = ({
  maze,
  player,
  treasures,
  exitCell,
  gridCells,
  hintPaths,
  onCellClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const COLS = 15;
  const ROWS = 15;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const CELL_SIZE = canvas.width / COLS;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = "rgba(255,215,0,0.3)";
      ctx.lineWidth = 1;
      for (let c = 0; c <= COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * CELL_SIZE, 0);
        ctx.lineTo(c * CELL_SIZE, canvas.height);
        ctx.stroke();
      }
      for (let r = 0; r <= ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * CELL_SIZE);
        ctx.lineTo(canvas.width, r * CELL_SIZE);
        ctx.stroke();
      }

      // Draw maze walls with improved visibility
      maze.forEach((cell) => {
        const x = cell.col * CELL_SIZE, y = cell.row * CELL_SIZE;
        
        // More prominent wall rendering
        ctx.strokeStyle = "#00BFFF"; // Deep Sky Blue for visibility
        ctx.lineWidth = 4; // Increased line width
        ctx.shadowColor = "rgba(0,191,255,0.5)"; // Soft glow effect
        ctx.shadowBlur = 5;

        // Draw each wall individually with clear borders
        if (cell.walls.top) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + CELL_SIZE, y);
          ctx.stroke();
        }
        if (cell.walls.right) {
          ctx.beginPath();
          ctx.moveTo(x + CELL_SIZE, y);
          ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
          ctx.stroke();
        }
        if (cell.walls.bottom) {
          ctx.beginPath();
          ctx.moveTo(x, y + CELL_SIZE);
          ctx.lineTo(x + CELL_SIZE, y + CELL_SIZE);
          ctx.stroke();
        }
        if (cell.walls.left) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + CELL_SIZE);
          ctx.stroke();
        }
      });

      // Reset shadow after drawing walls
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // Draw claimed cells
      gridCells.forEach((row, r) => {
        row.forEach((cell, c) => {
          if (cell.owner) {
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(c * CELL_SIZE, r * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            ctx.font = `bold ${CELL_SIZE / 2}px sans-serif`;
            ctx.fillStyle = "#FFD700";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(cell.nickname || "✓", c * CELL_SIZE + CELL_SIZE / 2, r * CELL_SIZE + CELL_SIZE / 2);
          }
        });
      });

      // Draw hint paths
      if (hintPaths.length > 0) {
        ctx.fillStyle = "rgba(0,255,255,0.3)";
        hintPaths.forEach(([col, row]) => {
          ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        });
      }

      // Draw treasures
      treasures.forEach((t) => {
        if (!t.collected) {
          ctx.fillStyle = "#FFD700";
          ctx.beginPath();
          ctx.arc(
            t.col * CELL_SIZE + CELL_SIZE / 2,
            t.row * CELL_SIZE + CELL_SIZE / 2,
            CELL_SIZE * 0.2,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      });

      // Draw player
      if (player) {
        ctx.fillStyle = "red";
        ctx.fillRect(
          player.col * CELL_SIZE + CELL_SIZE * 0.2,
          player.row * CELL_SIZE + CELL_SIZE * 0.2,
          CELL_SIZE * 0.6,
          CELL_SIZE * 0.6
        );
      }

      // Draw exit
      if (exitCell) {
        ctx.fillStyle = "green";
        ctx.fillRect(
          exitCell.col * CELL_SIZE + CELL_SIZE * 0.2,
          exitCell.row * CELL_SIZE + CELL_SIZE * 0.2,
          CELL_SIZE * 0.6,
          CELL_SIZE * 0.6
        );
      }
    };

    draw();
    const interval = setInterval(draw, 30);
    return () => clearInterval(interval);
  }, [maze, player, treasures, exitCell, gridCells, hintPaths]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    const cellCol = Math.floor(x / (canvas.width / COLS));
    const cellRow = Math.floor(y / (canvas.height / ROWS));
    
    if (cellCol >= 0 && cellRow >= 0 && cellCol < COLS && cellRow < ROWS) {
      onCellClick(cellCol, cellRow);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={600}
      className="bg-gradient-game border-4 border-brown shadow-lg rounded-lg max-w-[95vw] mx-auto my-5"
      onClick={handleCanvasClick}
    />
  );
};

export default MazeCanvas;
