import React from 'react';
import { GameStateType } from '../types';
import { GridCell } from '@/types/game';
import { processCellClaim, DEVELOPER_ACCOUNT } from '@/lib/goldEconomy';

interface UseCellClaimProps {
  gameState: GameStateType;
  setGameState: React.Dispatch<React.SetStateAction<GameStateType>>;
  setGridCells: React.Dispatch<React.SetStateAction<GridCell[][]>>;
  setClaimTarget: React.Dispatch<React.SetStateAction<{ col: number; row: number } | null>>;
  setActiveModal: React.Dispatch<React.SetStateAction<string | null>>;
  setPlayer: React.Dispatch<
    React.SetStateAction<{
      col: number;
      row: number;
      hasClaimed?: boolean;
      hasClaimedEver?: boolean;
    } | null>
  >;
  toast: (opts: { title: string; description: string }) => void;
}

export const useCellClaim = ({
  gameState,
  setGameState,
  setGridCells,
  setClaimTarget,
  setActiveModal,
  setPlayer,
  toast,
}: UseCellClaimProps) => {
  // Now accepts the selected cell as an argument
  const claimCell = async (target?: { col: number; row: number }): Promise<boolean> => {
    if (!target) {
      console.error('No claim target set');
      toast({ title: 'Error', description: 'No cell selected.' });
      return false;
    }

    const { col, row } = target;
    const isEdge = row === 0 || row === 14 || col === 0 || col === 14;
    const cost = isEdge ? 20000 : 2000;

    if (gameState.walletBalance < cost) {
      toast({ title: 'Insufficient Funds', description: `Need ${cost} gold.` });
      setActiveModal('buy');
      return false;
    }

    try {
      // Split the payment
      const { developerAmount } = processCellClaim(cost);

      // Deduct cost & tag claim with WAX address
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - cost,
        totalLoss: prev.totalLoss + cost,
        playerClaimed: true,
        playerNickname: prev.playerAccount,
        playerInitials: '',
      }));

      // Update the grid immutably
      setGridCells(prev => {
        const newRow = [...prev[row]];
        newRow[col] = {
          ...newRow[col],
          owner: gameState.playerAccount || 'local-player',
          nickname: gameState.playerAccount || '',
        };
        return prev.map((r, i) => (i === row ? newRow : r));
      });

      // Move the player marker
      setPlayer({ col, row, hasClaimed: true, hasClaimedEver: true });

      // Close modal & clear target
      setClaimTarget(null);
      setActiveModal(null);

      toast({ title: 'Cell Claimed!', description: `Claimed for ${cost} gold.` });
      console.log(`Developer got ${developerAmount} gold: ${DEVELOPER_ACCOUNT}`);
      return true;
    } catch (error) {
      console.error('Error claiming cell:', error);
      toast({ title: 'Claim Failed', description: 'Try again.' });
      return false;
    }
  };

  return { claimCell };
};
