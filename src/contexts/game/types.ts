
import { Cell, PlayerPosition, Treasure, GridCell, Achievement, LeaderboardEntry } from '@/types/game';

export interface GameStateType {
  phase: "claim" | "play";
  score: number;
  highScore: number;
  walletBalance: number;
  totalProfit: number;
  totalLoss: number;
  playerNickname: string;
  playerWaxWallet: string;
  playerAccount: string;
  playerClaimed: boolean;
  gameOver: boolean;
  timeRemaining: number;
  startTime: number;
  activeModal: string | null;
  claimTarget: { col: number; row: number } | null;
}

export interface GameContextType {
  maze: Cell[];
  player: PlayerPosition | null;
  treasures: Treasure[];
  exitCell: { col: number; row: number } | null;
  gridCells: GridCell[][];
  hintPaths: number[][];
  gameState: GameStateType;
  achievements: Achievement[];
  leaderboard: LeaderboardEntry[];
  isWalletConnected: boolean;
  isMenuOpen: boolean;
  activeModal: string | null;
  claimTarget: {col: number, row: number} | null;
  onCellClick: (col: number, row: number) => void;
  initializeGame: () => void;
  showHint: () => void;
  newRound: () => void;
  movePlayer: (direction: 'up' | 'down' | 'left' | 'right') => void;
  connectWallet: () => Promise<boolean>;
  buyPgl: (amount: number, currency?: 'pgl' | 'wax') => Promise<boolean>;
  convertGoldToPGL: (goldAmount: number) => Promise<boolean>;
  toggleMenu: () => void;
  showModal: (modalName: string | null) => void;
  claimCell: (nickname: string, initials: string) => Promise<boolean>;
}
