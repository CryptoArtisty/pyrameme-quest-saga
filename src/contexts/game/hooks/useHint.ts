
import { useCallback, useState } from 'react';
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
  
  const showHint = useCallback(() => {
    if (gameState.phase !== 'play' || !player || !exitCell) {
      toast({
        title: "Hint Not Available",
        description: "Hints are only available during the play phase.",
      });
      return;
    }
    
    const cost = 1000; // 1000 gold for a hint
    
    if (gameState.walletBalance < cost) {
      toast({
        title: "Insufficient Funds",
        description: `You need ${cost} gold to get a hint.`,
      });
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - cost
    }));
    
    // Simple hint showing a path (this is just for demo purposes)
    const newHintPaths: number[][] = [];
    let currentCol = player.col;
    let currentRow = player.row;
    const targetCol = exitCell.col;
    const targetRow = exitCell.row;
    
    while (currentCol !== targetCol || currentRow !== targetRow) {
      if (currentCol < targetCol) currentCol++;
      else if (currentCol > targetCol) currentCol--;
      else if (currentRow < targetRow) currentRow++;
      else if (currentRow > targetRow) currentRow--;
      
      newHintPaths.push([currentCol, currentRow]);
      
      if (newHintPaths.length > 10) break; // Limit the hint path length
    }
    
    setHintPaths(newHintPaths);
    
    setTimeout(() => {
      setHintPaths([]);
    }, 3000);
    
    toast({
      title: "Hint Activated",
      description: "Follow the highlighted path!",
    });
  }, [gameState, player, exitCell, setGameState, toast]);
  
  return { hintPaths, showHint };
};
