
import React, { useRef, useEffect } from 'react';
import { Cell, PlayerPosition, Treasure, GridCell } from '@/types/game';
import { Grid } from './maze/Grid';
import { ClaimedCells } from './maze/ClaimedCells';
import { MazeWalls } from './maze/MazeWalls';
import { GameElements } from './maze/GameElements';

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

      Grid({ cols: COLS, rows: ROWS, cellSize: CELL_SIZE, ctx });
      ClaimedCells({ gridCells, cellSize: CELL_SIZE, ctx });
      MazeWalls({ maze, cellSize: CELL_SIZE, ctx });
      GameElements({ treasures, exitCell, player, cellSize: CELL_SIZE, ctx, hintPaths });
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
      console.log("Canvas clicked at cell:", cellCol, cellRow);
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
