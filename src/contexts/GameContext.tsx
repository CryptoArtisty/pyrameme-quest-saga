
import React, { createContext, useContext, useState, useEffect } from 'react';
import { GameState, Cell, PlayerPosition, Treasure, GridCell } from '@/types/game';

interface GameContextType extends GameState {
  maze: Cell[];
  player: PlayerPosition | null;
  treasures: Treasure[];
  exitCell: PlayerPosition | null;
  gridCells: GridCell[][];
  hintPaths: number[][];
  initGame: () => void;
  handleCellClaim: (col: number, row: number) => void;
  handlePlayerMove: (col: number, row: number) => void;
  showHint: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    phase: "claim",
    score: 0,
    walletBalance: 224,
    totalProfit: 0,
    totalLoss: 0,
    playerNickname: "",
    playerKemWallet: "",
    playerClaimed: false,
    gameOver: false,
  });

  const [maze, setMaze] = useState<Cell[]>([]);
  const [player, setPlayer] = useState<PlayerPosition | null>(null);
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [exitCell, setExitCell] = useState<PlayerPosition | null>(null);
  const [gridCells, setGridCells] = useState<GridCell[][]>([]);
  const [hintPaths, setHintPaths] = useState<number[][]>([]);

  // Initialize the game
  const initGame = () => {
    // Implementation here
  };

  // Handle cell claiming
  const handleCellClaim = (col: number, row: number) => {
    // Implementation here
  };

  // Handle player movement
  const handlePlayerMove = (col: number, row: number) => {
    // Implementation here
  };

  // Show hint paths
  const showHint = () => {
    // Implementation here
  };

  return (
    <GameContext.Provider
      value={{
        ...gameState,
        maze,
        player,
        treasures,
        exitCell,
        gridCells,
        hintPaths,
        initGame,
        handleCellClaim,
        handlePlayerMove,
        showHint,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
