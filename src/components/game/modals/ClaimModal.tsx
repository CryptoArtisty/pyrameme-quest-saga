
import React from 'react';
import { useGame } from '@/contexts/game/GameContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const ClaimModal = () => {
  const { activeModal, showModal, claimTarget, claimCell, gameState } = useGame();
  const [nickname, setNickname] = React.useState('');
  const [initials, setInitials] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // FIXED: Reset form when modal is opened
  React.useEffect(() => {
    if (activeModal === 'claim') {
      setNickname('');
      setInitials('');
      setIsSubmitting(false);
    }
  }, [activeModal]);

  const handleClaim = async () => {
    if (!claimTarget) {
      console.error("No claim target set");
      return;
    }
    
    if (!nickname.trim() || !initials.trim()) {
      console.error("Nickname or initials missing");
      return; // Button is disabled in this case
    }

    setIsSubmitting(true);
    console.log("Attempting to claim cell with:", {nickname, initials, target: claimTarget});
    
    try {
      const success = await claimCell(nickname, initials);
      console.log("Claim result:", success);
      
      if (success) {
        showModal(null);
      }
    } catch (error) {
      console.error('Error claiming cell:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate the cost based on if it's an edge cell
  const getCost = () => {
    if (!claimTarget) return 2000;
    const { col, row } = claimTarget;
    const isEdge = row === 0 || row === 14 || col === 0 || col === 14;
    return isEdge ? 20000 : 2000;
  };

  const cost = getCost();
  const canAfford = gameState.walletBalance >= cost;

  return (
    <Dialog open={activeModal === 'claim'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>Claim This Cell</DialogTitle>
          <DialogDescription className="text-sand">
            Enter your nickname and initials to claim this cell for {cost} gold.
            {!canAfford && (
              <div className="text-red-500 mt-2">
                You don't have enough gold to claim this cell. Current balance: {gameState.walletBalance} gold
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium text-gold">
              Nickname (required)
            </label>
            <input
              id="nickname"
              className="w-full p-2 bg-dark border border-gold rounded-md text-gold"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              placeholder="Enter your nickname"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="initials" className="text-sm font-medium text-gold">
              Initials (1-2 characters, required)
            </label>
            <input
              id="initials"
              className="w-full p-2 bg-dark border border-gold rounded-md text-gold"
              value={initials}
              onChange={(e) => setInitials(e.target.value.substring(0, 2))}
              maxLength={2}
              placeholder="AB"
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => showModal(null)}
            className="border-gold text-gold hover:bg-gold/20"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClaim}
            disabled={!canAfford || !nickname.trim() || !initials.trim() || isSubmitting}
            className={`${canAfford ? 'bg-gold text-dark hover:bg-gold/80' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
          >
            {isSubmitting ? 'Claiming...' : 'Claim Cell'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
