
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { GameStateType } from './types';
import { Cell, PlayerPosition, Treasure, GridCell } from '@/types/game';
import { 
  generateMaze,
  generateTreasures,
  generateInitialGridCells,
  generateRandomStartPosition,
  generateRandomExit,
  showConfetti
} from './gameUtils';

const defaultGameState: GameStateType = {
  phase: "claim",
  score: 0,
  highScore: 0,
  walletBalance: 1224, // Updated starting balance to 1,224 gold coins
  totalProfit: 0,
  totalLoss: 0,
  playerNickname: "",
  playerWaxWallet: "",
  playerAccount: "",
  playerClaimed: false,
  gameOver: false,
  timeRemaining: 10,
  startTime: Date.now(),
  activeModal: null,
  claimTarget: null
};

export const useGameState = () => {
  const { toast } = useToast();
  const [maze, setMaze] = useState<Cell[]>([]);
  const [player, setPlayer] = useState<PlayerPosition | null>(null);
  const [treasures, setTreasures] = useState<Treasure[]>([]);
  const [exitCell, setExitCell] = useState<{ col: number; row: number } | null>(null);
  const [gridCells, setGridCells] = useState<GridCell[][]>(generateInitialGridCells());
  const [gameState, setGameState] = useState<GameStateType>(defaultGameState);
  const [achievements] = useState([]);
  const [leaderboard] = useState([]);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [claimTarget, setClaimTarget] = useState<{col: number, row: number} | null>(null);

  const startPlayPhase = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'play',
      timeRemaining: 300,
      startTime: Date.now()
    }));
    
    setMaze(generateMaze());
    setTreasures(generateTreasures());
    setPlayer(generateRandomStartPosition());
    setExitCell(generateRandomExit());
    
    toast({
      title: "Play Phase Started!",
      description: "Find the treasures and reach the exit!",
    });
  }, [toast]);

  const handleGameOver = async () => {
    setGameState(prev => ({ ...prev, gameOver: true }));
    
    if (gameState.score > gameState.highScore) {
      setGameState(prev => ({
        ...prev,
        highScore: gameState.score
      }));
      showConfetti();
    }
    
    setActiveModal("victory");
  };

  return {
    maze, setMaze,
    player, setPlayer,
    treasures, setTreasures,
    exitCell, setExitCell,
    gridCells, setGridCells,
    gameState, setGameState,
    achievements,
    leaderboard,
    isWalletConnected, setIsWalletConnected,
    isMenuOpen, setIsMenuOpen,
    activeModal, setActiveModal,
    claimTarget, setClaimTarget,
    startPlayPhase,
    handleGameOver,
    defaultGameState,
    toast
  };
};
