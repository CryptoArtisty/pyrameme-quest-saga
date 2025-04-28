
import { GameStateType } from '../types';
import { GridCell } from '@/types/game';
import { processCellClaim, DEVELOPER_ACCOUNT } from '@/lib/goldEconomy';

interface UseCellClaimProps {
  gameState: GameStateType;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  setGridCells: (cells: React.SetStateAction<GridCell[][]>) => void;
  setClaimTarget: (target: { col: number; row: number } | null) => void;
  setActiveModal: (modal: string | null) => void;
  setPlayer: (
    player: { col: number; row: number; hasClaimed?: boolean; hasClaimedEver?: boolean } | null
  ) => void;
  toast: any;
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
  const claimCell = async (): Promise<boolean> => {
    const target = gameState.claimTarget;
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
      // payment splits
      const { developerAmount } = processCellClaim(cost);

      // deduct cost and mark claimed by account
      setGameState((prev) => ({
        ...prev,
        walletBalance: prev.walletBalance - cost,
        totalLoss: prev.totalLoss + cost,
        playerClaimed: true,
        playerNickname: prev.playerAccount,   // record address
        playerInitials: '',                   // clear initials
      }));

      // paint the grid cell
      setGridCells((prev) => {
        const newCells = JSON.parse(JSON.stringify(prev)) as GridCell[][];
        newCells[row] = newCells[row] || [];
        newCells[row][col] = {
          ...newCells[row][col],
          owner: gameState.playerAccount || 'local-player',
          nickname: gameState.playerAccount || '',
        };
        return newCells;
      });

      // move player marker
      setPlayer({ col, row, hasClaimed: true, hasClaimedEver: true });

      // close the modal
      setClaimTarget(null);
      setActiveModal(null);

      toast({
        title: 'Cell Claimed!',
        description: `Claimed for ${cost} gold.`,
      });

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
