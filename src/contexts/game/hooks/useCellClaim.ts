
import { GameStateType } from '../types';
import { GridCell } from '@/types/game';
import { processCellClaim, DEVELOPER_ACCOUNT } from '@/lib/goldEconomy';

interface UseCellClaimProps {
  gameState: GameStateType;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  setGridCells: (cells: React.SetStateAction<GridCell[][]>) => void;
  setClaimTarget: (target: { col: number; row: number } | null) => void;
  setActiveModal: (modal: string | null) => void;
  setPlayer: (player: { col: number; row: number; hasClaimed?: boolean; hasClaimedEver?: boolean } | null) => void;
  toast: any;
}

export const useCellClaim = ({
  gameState,
  setGameState,
  setGridCells,
  setClaimTarget,
  setActiveModal,
  setPlayer,
  toast
}: UseCellClaimProps) => {
  const claimCell = async (nickname: string, initials: string): Promise<boolean> => {
    const target = gameState.claimTarget;
    if (!target) return false;
    
    try {
      const { col, row } = target;
      console.log("Claiming cell at:", col, row);
      
      // Check if the cell is on the edge of the grid
      const isEdge = row === 0 || row === 14 || col === 0 || col === 14;
      // Edge cells cost 20,000 gold, other cells cost 2,000 gold
      const cost = isEdge ? 20000 : 2000;
      
      if (gameState.walletBalance < cost) {
        toast({
          title: "Insufficient Funds",
          description: `You need ${cost} gold to claim this cell.`,
        });
        setActiveModal("buy");
        return false;
      }
      
      // Process the cell claim payment distribution
      const { treasuryAmount, developerAmount } = processCellClaim(cost);
      
      // Update game state with new balance and player info
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - cost,
        totalLoss: prev.totalLoss + cost,
        playerNickname: nickname,
        playerInitials: initials,
        playerClaimed: true
      }));
      
      // Update grid cells with claimed cell
      setGridCells(prevCells => {
        const newCells = JSON.parse(JSON.stringify(prevCells)); // Deep copy
        
        // Ensure the row exists
        if (!newCells[row]) {
          newCells[row] = [];
        }
        
        // Set the cell owner and nickname
        newCells[row][col] = {
          ...newCells[row]?.[col],
          owner: gameState.playerAccount || 'local-player',
          nickname: initials
        };
        
        console.log("Updated grid cells:", newCells);
        return newCells;
      });

      // FIXED: Set the claimed cell as the player's starting position
      // This is crucial - we're explicitly setting the player position and claim flags
      setPlayer({ 
        col, 
        row,
        hasClaimed: true,    // Player has claimed in current game
        hasClaimedEver: true // Player has claimed at least once
      });
      
      // Log player position for debugging
      console.log("Player position set to:", col, row, "with hasClaimed=true");
      
      // Reset claim target and close modal
      setClaimTarget(null);
      setActiveModal(null);
      
      toast({
        title: "Cell Claimed!",
        description: `You've successfully claimed this cell for ${cost} gold.`,
      });
      
      // In a real implementation, this would trigger a blockchain transaction
      console.log(`Sent ${developerAmount} gold to developer account: ${DEVELOPER_ACCOUNT}`);
      console.log(`Player token placed at position: col=${col}, row=${row}`);
      
      return true;
    } catch (error) {
      console.error("Error claiming cell:", error);
      toast({
        title: "Claim Failed",
        description: "Could not claim the cell.",
      });
      return false;
    }
  };

  return { claimCell };
};
