
import { GameStateType } from '../types';

interface UseExitCellProps {
  gameState: GameStateType;
  exitCell: { col: number; row: number } | null;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  handleGameOver: () => void;
  toast: any;
}

export const useExitCell = ({
  gameState,
  exitCell,
  setGameState,
  handleGameOver,
  toast
}: UseExitCellProps) => {
  const handleExitReached = (col: number, row: number) => {
    if (!exitCell || col !== exitCell.col || row !== exitCell.row) return;

    const timeBonus = Math.floor(gameState.timeRemaining * 0.5);
    
    setGameState(prev => ({
      ...prev,
      score: prev.score + timeBonus,
      totalProfit: prev.totalProfit + timeBonus
    }));
    
    toast({
      title: "Exit Reached!",
      description: `Time bonus: ${timeBonus} points!`,
    });
    
    handleGameOver();
  };

  return { handleExitReached };
};
