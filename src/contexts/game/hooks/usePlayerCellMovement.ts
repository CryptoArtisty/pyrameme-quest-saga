
import { useCallback } from 'react';
import { PlayerPosition, GridCell } from '@/types/game';
import { GameStateType } from '../types';
import { processParking } from '@/lib/goldEconomy';

interface UsePlayerCellMovementProps {
  gameState: GameStateType;
  player: PlayerPosition | null;
  gridCells: GridCell[][];
  collectTreasure: (col: number, row: number) => void;
  handleExitReached: (col: number, row: number) => void;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  setPlayer: (position: PlayerPosition | null) => void;
  toast: any;
}

export const usePlayerCellMovement = ({
  gameState,
  player,
  gridCells,
  collectTreasure,
  handleExitReached,
  setGameState,
  setPlayer,
  toast
}: UsePlayerCellMovementProps) => {
  const movePlayerToCell = useCallback((col: number, row: number, additionalProps?: { hasClaimed?: boolean; hasClaimedEver?: boolean }) => {
    if (!player) {
      console.log("Cannot move player: player is null");
      return;
    }
    
    console.log("Moving player to cell:", col, row);
    
    if (!gridCells[row] || !gridCells[row][col]) {
      console.log("Target cell doesn't exist in the grid");
      return;
    }
    
    const cell = gridCells[row][col];
    
    if (cell.owner) {
      const isOwnCell = cell.owner === gameState.playerAccount;
      
      if (!isOwnCell) {
        if (gameState.walletBalance < 1) {
          toast({
            title: "Insufficient Funds",
            description: "You need at least 1 gold to park on someone else's cell.",
          });
          return;
        }

        setGameState(prev => ({
          ...prev,
          walletBalance: prev.walletBalance - 1,
          totalLoss: prev.totalLoss + 1
        }));

        processParking(1, cell.owner);

        toast({
          title: "Parking Fee Paid",
          description: `You paid 1 gold to ${cell.nickname || 'parking fee collector'}.`,
        });
      }
    }

    collectTreasure(col, row);
    handleExitReached(col, row);
    
    // Set player position while preserving claim status properties
    setPlayer({ 
      col, 
      row,
      // Use provided properties or fall back to existing ones or defaults
      hasClaimed: additionalProps?.hasClaimed !== undefined ? additionalProps.hasClaimed : player.hasClaimed,
      hasClaimedEver: additionalProps?.hasClaimedEver !== undefined ? additionalProps.hasClaimedEver : (player.hasClaimedEver !== undefined ? player.hasClaimedEver : true)
    });
    
    console.log("Player position updated to:", col, row);
  }, [gameState, player, gridCells, collectTreasure, handleExitReached, setGameState, setPlayer, toast]);

  return { movePlayerToCell };
};
