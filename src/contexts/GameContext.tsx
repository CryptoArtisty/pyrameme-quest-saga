
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Cell, PlayerPosition, Treasure, GridCell, GameState } from '@/types/game';

interface GameContextType {
  maze: Cell[];
  player: PlayerPosition | null;
  treasures: Treasure[];
  exitCell: { col: number; row: number } | null;
  gridCells: GridCell[][];
  hintPaths: [number, number][][];
  gameState: GameState;
  onCellClick: (col: number, row: number) => void;
  initializeGame: () => void;
  showHint: () => void;
  newRound: () => void;
}

const defaultGameState: GameState = {
  phase: "claim",
  score: 0,
  walletBalance: 224,
  totalProfit: 0,
  totalLoss: 0,
  playerNickname: "",
  playerKemWallet: "",
  playerClaimed: false,
  gameOver: false,
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const [maze, setMaze] = useState<Cell[]>([]);
  const [player, setPlayer] = useState<PlayerPosition | null>(null);
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [exitCell, setExitCell] = useState<{ col: number; row: number } | null>(null);
  const [gridCells, setGridCells] = useState<GridCell[][]>([]);
  const [hintPaths, setHintPaths] = useState<[number, number][][]>([]);
  const [gameState, setGameState] = useState<GameState>(defaultGameState);

  const onCellClick = (col: number, row: number) => {
    // Cell click logic will be implemented here
    console.log(`Cell clicked: ${col}, ${row}`);
  };

  const initializeGame = useCallback(() => {
    // Initialize empty grid cells
    const initGridCells: GridCell[][] = [];
    for (let r = 0; r < 15; r++) {
      initGridCells[r] = [];
      for (let c = 0; c < 15; c++) {
        initGridCells[r][c] = { owner: null, nickname: "" };
      }
    }
    setGridCells(initGridCells);
    
    // Game initialization logic will be implemented here
    console.log("Game initialized");
  }, []);

  const showHint = () => {
    // Hint logic will be implemented here
    console.log("Hint shown");
  };

  const newRound = () => {
    // New round logic will be implemented here
    console.log("New round started");
  };

  return (
    <GameContext.Provider
      value={{
        maze,
        player,
        treasures,
        exitCell,
        gridCells,
        hintPaths,
        gameState,
        onCellClick,
        initializeGame,
        showHint,
        newRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
