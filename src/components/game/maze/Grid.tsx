
import React from 'react';

interface GridProps {
  cols: number;
  rows: number;
  cellSize: number;
  ctx: CanvasRenderingContext2D;
}

export const Grid = ({ cols, rows, cellSize, ctx }: GridProps) => {
  ctx.strokeStyle = "rgba(255,215,0,0.3)";
  ctx.lineWidth = 1;
  
  // Draw vertical lines
  for (let c = 0; c <= cols; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cellSize, 0);
    ctx.lineTo(c * cellSize, rows * cellSize);
    ctx.stroke();
  }
  
  // Draw horizontal lines
  for (let r = 0; r <= rows; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellSize);
    ctx.lineTo(cols * cellSize, r * cellSize);
    ctx.stroke();
  }
};
