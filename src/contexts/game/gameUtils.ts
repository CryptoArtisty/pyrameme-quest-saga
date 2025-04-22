import { Cell, PlayerPosition, Treasure, GridCell } from '@/types/game';
import { GameStateType } from './types';

const removeWalls = (current: Cell, next: Cell) => {
  const dx = next.col - current.col;
  const dy = next.row - current.row;
  
  if (dx === 1) {
    current.walls.right = false;
    next.walls.left = false;
  } else if (dx === -1) {
    current.walls.left = false;
    next.walls.right = false;
  }
  
  if (dy === 1) {
    current.walls.bottom = false;
    next.walls.top = false;
  } else if (dy === -1) {
    current.walls.top = false;
    next.walls.bottom = false;
  }
};

export const generateMaze = (): Cell[] => {
  const COLS = 15;
  const ROWS = 15;
  const newMaze: Cell[] = [];
  
  // Initialize grid with walls
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      newMaze.push({
        row: r,
        col: c,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false
      });
    }
  }
  
  // Depth-first search maze generation
  const stack: Cell[] = [];
  const getCell = (col: number, row: number) => 
    newMaze.find(cell => cell.col === col && cell.row === row);
  
  const startCell = newMaze[0];
  startCell.visited = true;
  stack.push(startCell);
  
  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = [];
    
    // Check all 4 directions
    const directions = [
      { dx: 0, dy: -1 }, // top
      { dx: 1, dy: 0 },  // right
      { dx: 0, dy: 1 },  // bottom
      { dx: -1, dy: 0 }  // left
    ];
    
    for (const dir of directions) {
      const nextCol = current.col + dir.dx;
      const nextRow = current.row + dir.dy;
      
      if (nextCol >= 0 && nextCol < COLS && 
          nextRow >= 0 && nextRow < ROWS) {
        const neighbor = getCell(nextCol, nextRow);
        if (neighbor && !neighbor.visited) {
          neighbors.push(neighbor);
        }
      }
    }
    
    if (neighbors.length > 0) {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      next.visited = true;
      removeWalls(current, next);
      stack.push(next);
    } else {
      stack.pop();
    }
  }
  
  // Reset visited property as it's no longer needed
  newMaze.forEach(cell => cell.visited = false);
  
  return newMaze;
};

export const generateTreasures = (): Treasure[] => {
  const newTreasures: Treasure[] = [];
  const cellCount = 15 * 15;
  const treasureCount = Math.floor(cellCount * 0.1);
  
  for (let i = 0; i < treasureCount; i++) {
    let col, row;
    do {
      col = Math.floor(Math.random() * 15);
      row = Math.floor(Math.random() * 15);
    } while (newTreasures.some(t => t.col === col && t.row === row));
    
    newTreasures.push({
      col,
      row,
      collected: false,
      value: 5 + Math.floor(Math.random() * 70)
    });
  }
  
  return newTreasures;
};

export const generateInitialGridCells = (): GridCell[][] => {
  const initGridCells: GridCell[][] = [];
  for (let r = 0; r < 15; r++) {
    initGridCells[r] = [];
    for (let c = 0; c < 15; c++) {
      initGridCells[r][c] = { owner: null, nickname: "" };
    }
  }
  return initGridCells;
};

export const generateRandomStartPosition = (): PlayerPosition => ({
  col: Math.floor(Math.random() * 15),
  row: Math.floor(Math.random() * 15)
});

export const generateRandomExit = (): { col: number; row: number } => {
  const edges = [
    { col: Math.floor(Math.random() * 15), row: 0 },
    { col: 14, row: Math.floor(Math.random() * 15) },
    { col: Math.floor(Math.random() * 15), row: 14 },
    { col: 0, row: Math.floor(Math.random() * 15) }
  ];
  return edges[Math.floor(Math.random() * edges.length)];
};

export const showConfetti = () => {
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti';
  document.body.appendChild(confettiContainer);
  
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.left = `${Math.random() * 100}%`;
    confetti.style.backgroundColor = ['#FFD700', '#c2b280', '#4a3728'][Math.floor(Math.random() * 3)];
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    confettiContainer.appendChild(confetti);
  }
  
  setTimeout(() => {
    confettiContainer.remove();
  }, 3000);
};
