import { Cell, Treasure } from '@/types/game';

// Generate a maze using a randomized depth-first search (DFS) algorithm
export const generateMaze = (): Cell[] => {
  const COLS = 15;
  const ROWS = 15;
  const maze: Cell[] = [];
  
  // Initialize all cells with all walls intact
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      maze.push({
        col,
        row,
        walls: {
          top: true,
          right: true,
          bottom: true,
          left: true
        },
        visited: false
      });
    }
  }
  
  // Find a cell by its coordinates
  const getCell = (col: number, row: number) => 
    maze.find(cell => cell.col === col && cell.row === row);
  
  // Get the neighbors of a cell that have not been visited
  const getUnvisitedNeighbors = (cell: Cell) => {
    const neighbors: Cell[] = [];
    const {col, row} = cell;
    
    // Check top neighbor
    if (row > 0) {
      const top = getCell(col, row - 1);
      if (top && !top.visited) neighbors.push(top);
    }
    
    // Check right neighbor
    if (col < COLS - 1) {
      const right = getCell(col + 1, row);
      if (right && !right.visited) neighbors.push(right);
    }
    
    // Check bottom neighbor
    if (row < ROWS - 1) {
      const bottom = getCell(col, row + 1);
      if (bottom && !bottom.visited) neighbors.push(bottom);
    }
    
    // Check left neighbor
    if (col > 0) {
      const left = getCell(col - 1, row);
      if (left && !left.visited) neighbors.push(left);
    }
    
    return neighbors;
  };
  
  // Remove walls between two cells
  const removeWalls = (current: Cell, next: Cell) => {
    // If next is above current
    if (next.row < current.row) {
      current.walls.top = false;
      next.walls.bottom = false;
    }
    // If next is to the right of current
    else if (next.col > current.col) {
      current.walls.right = false;
      next.walls.left = false;
    }
    // If next is below current
    else if (next.row > current.row) {
      current.walls.bottom = false;
      next.walls.top = false;
    }
    // If next is to the left of current
    else if (next.col < current.col) {
      current.walls.left = false;
      next.walls.right = false;
    }
  };
  
  // Maze generation using DFS
  const generateMazeWithDFS = () => {
    // Start at a random cell
    const startCol = Math.floor(Math.random() * COLS);
    const startRow = Math.floor(Math.random() * ROWS);
    const startCell = getCell(startCol, startRow);
    
    if (!startCell) return;
    
    startCell.visited = true;
    const stack: Cell[] = [startCell];
    
    while (stack.length > 0) {
      const current = stack[stack.length - 1];
      const neighbors = getUnvisitedNeighbors(current);
      
      if (neighbors.length === 0) {
        stack.pop();
      } else {
        const randomIndex = Math.floor(Math.random() * neighbors.length);
        const next = neighbors[randomIndex];
        
        next.visited = true;
        removeWalls(current, next);
        stack.push(next);
      }
    }
    
    // Reset visited property for future use
    maze.forEach(cell => cell.visited = false);
  };
  
  generateMazeWithDFS();
  
  // Return the generated maze
  return maze;
};

// Generate random treasures
export const generateTreasures = (): Treasure[] => {
  const treasures: Treasure[] = [];
  const COLS = 15;
  const ROWS = 15;
  const NUM_TREASURES = 10;
  
  // Create a set to track used positions
  const usedPositions = new Set();
  
  for (let i = 0; i < NUM_TREASURES; i++) {
    let col, row;
    let positionKey;
    
    // Keep generating positions until we find an unused one
    do {
      col = Math.floor(Math.random() * COLS);
      row = Math.floor(Math.random() * ROWS);
      positionKey = `${col}-${row}`;
    } while (usedPositions.has(positionKey));
    
    // Mark this position as used
    usedPositions.add(positionKey);
    
    // Create the treasure with a random value between 10 and 100
    treasures.push({
      col,
      row,
      collected: false,
      value: Math.floor(Math.random() * 91) + 10
    });
  }
  
  return treasures;
};

// Generate initial grid cells (all unclaimed)
export const generateInitialGridCells = () => {
  const COLS = 15;
  const ROWS = 15;
  const grid = [];
  
  for (let row = 0; row < ROWS; row++) {
    grid[row] = [];
    for (let col = 0; col < COLS; col++) {
      grid[row][col] = {
        owner: null,
        nickname: ''
      };
    }
  }
  
  return grid;
};

// Generate a random starting position
export const generateRandomStartPosition = () => {
  const COLS = 15;
  const ROWS = 15;
  
  // Generate random position not on the edge
  const col = Math.floor(Math.random() * (COLS - 4)) + 2;
  const row = Math.floor(Math.random() * (ROWS - 4)) + 2;
  
  return { col, row };
};

// Generate a random exit cell (always on the edge)
export const generateRandomExit = () => {
  const COLS = 15;
  const ROWS = 15;
  
  // Decide which edge to put the exit on
  const edge = Math.floor(Math.random() * 4);
  
  let col, row;
  switch (edge) {
    case 0: // Top edge
      col = Math.floor(Math.random() * COLS);
      row = 0;
      break;
    case 1: // Right edge
      col = COLS - 1;
      row = Math.floor(Math.random() * ROWS);
      break;
    case 2: // Bottom edge
      col = Math.floor(Math.random() * COLS);
      row = ROWS - 1;
      break;
    case 3: // Left edge
      col = 0;
      row = Math.floor(Math.random() * ROWS);
      break;
    default:
      col = 0;
      row = 0;
  }
  
  return { col, row };
};

// Show confetti animation for celebration
export const showConfetti = () => {
  // This would be implemented with a confetti library
  console.log("Showing confetti animation!");
};
