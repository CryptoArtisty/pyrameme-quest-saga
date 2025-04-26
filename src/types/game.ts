
export interface Cell {
  col: number;
  row: number;
  walls: {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
  };
  visited: boolean;
}

export interface GridCell {
  owner: string | null;
  nickname: string;
}

export interface Treasure {
  col: number;
  row: number;
  collected: boolean;
  value: number;
}

export interface PlayerPosition {
  col: number;
  row: number;
  hasClaimed?: boolean; // Added to track if player claimed in current game
  hasClaimedEver?: boolean; // Added to track if player has ever claimed a cell
}

export interface GameState {
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
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

export interface LeaderboardEntry {
  account: string;
  score: number;
  timestamp: string;
}
