
import { Treasure } from '@/types/game';
import { GameStateType } from '../types';
import { processTreasureReward } from '@/lib/goldEconomy';

interface UseTreasureCollectionProps {
  treasures: Treasure[];
  setTreasures: (treasures: Treasure[]) => void;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  toast: any;
}

export const useTreasureCollection = ({
  treasures,
  setTreasures,
  setGameState,
  toast
}: UseTreasureCollectionProps) => {
  const collectTreasure = (col: number, row: number) => {
    const treasure = treasures.find(t => t.col === col && t.row === row && !t.collected);
    if (!treasure) return;

    // Try to withdraw the treasure value from the treasury
    const success = processTreasureReward(treasure.value);
    
    // If treasury has insufficient funds, reduce the reward or skip
    const actualReward = success ? treasure.value : Math.min(treasure.value, 1);
    
    if (!success && actualReward > 0) {
      toast({
        title: "Partial Treasure",
        description: `Treasury low on funds. You found ${actualReward} gold!`,
      });
    } else if (!success) {
      toast({
        title: "Empty Treasure",
        description: "This treasure chest is empty. The treasury is depleted!",
      });
      return;
    }

    const updatedTreasures = treasures.map(t => {
      if (t.col === col && t.row === row) {
        return { ...t, collected: true };
      }
      return t;
    });
    
    setTreasures(updatedTreasures);
    setGameState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + actualReward,
      score: prev.score + actualReward,
      totalProfit: prev.totalProfit + actualReward
    }));
    
    toast({
      title: "Treasure Found!",
      description: `You found ${actualReward} gold!`,
    });
  };

  return { collectTreasure };
};
