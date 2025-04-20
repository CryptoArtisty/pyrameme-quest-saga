
import { useState } from 'react';
import { GameStateType } from '../types';
import { PlayerPosition } from '@/types/game';

interface UseHintProps {
  gameState: GameStateType;
  player: PlayerPosition | null;
  exitCell: { col: number; row: number } | null;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  toast: any;
}

export const useHint = ({
  gameState,
  player,
  exitCell,
  setGameState,
  toast
}: UseHintProps) => {
  const [hintPaths, setHintPaths] = useState<number[][]>([]);

  const showHint = () => {
    if (gameState.phase !== 'play' || !player || !exitCell) return;
    
    if (gameState.walletBalance < 10) {
      toast({
        title: "Insufficient Funds",
        description: "You need 10 Pgl to get a hint.",
      });
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - 10,
      totalLoss: prev.totalLoss + 10
    }));
    
    const hintPath: number[][] = [];
    const dx = exitCell.col - player.col;
    const dy = exitCell.row - player.row;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
    for (let i = 1; i <= steps; i++) {
      const progress = i / steps;
      const x = Math.round(player.col + dx * progress);
      const y = Math.round(player.row + dy * progress);
      hintPath.push([x, y]);
    }
    
    setHintPaths(hintPath);
    
    setTimeout(() => {
      setHintPaths([]);
    }, 3000);
    
    toast({
      title: "Hint Activated",
      description: "Path to exit shown briefly.",
    });
  };

  return { hintPaths, showHint };
};
