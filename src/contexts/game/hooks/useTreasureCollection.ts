
import { Treasure } from '@/types/game';
import { GameStateType } from '../types';

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

    const updatedTreasures = treasures.map(t => {
      if (t.col === col && t.row === row) {
        return { ...t, collected: true };
      }
      return t;
    });
    
    setTreasures(updatedTreasures);
    setGameState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + treasure.value,
      score: prev.score + treasure.value,
      totalProfit: prev.totalProfit + treasure.value
    }));
    
    toast({
      title: "Treasure Found!",
      description: `You found ${treasure.value} Pgl!`,
    });
  };

  return { collectTreasure };
};
