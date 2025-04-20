
import { Cell, PlayerPosition, Treasure, GridCell } from '@/types/game';
import { GameStateType } from './types';

export const generateMaze = (): Cell[] => {
  const newMaze: Cell[] = [];
  for (let r = 0; r < 15; r++) {
    for (let c = 0; c < 15; c++) {
      newMaze.push({
        row: r,
        col: c,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false
      });
    }
  }
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
