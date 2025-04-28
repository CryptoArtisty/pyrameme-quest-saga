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
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Calculate cost same as before
  const getCost = () => {
    if (!claimTarget) return 2000;
    const { col, row } = claimTarget;
    const isEdge = row === 0 || row === 14 || col === 0 || col === 14;
    return isEdge ? 20000 : 2000;
  };
  const cost = getCost();
  const canAfford = gameState.walletBalance >= cost;
  const waxAccount = gameState.playerAccount || 'Unknown';

  const handleClaim = async () => {
    if (!claimTarget) return;
    setIsSubmitting(true);
    try {
      // pass the selected cell into claimCell
      const success = await claimCell(claimTarget);
      if (!success) setIsSubmitting(false);
    } catch {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={activeModal === 'claim'}
      onOpenChange={(open) => !open && showModal(null)}
    >
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>Claim This Cell</DialogTitle>
          <DialogDescription className="text-sand">
            You will claim this cell as <strong>{waxAccount}</strong> for {cost} gold.
            {!canAfford && (
              <div className="text-red-500 mt-2">
                You don't have enough gold ({gameState.walletBalance}) to claim this cell.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => showModal(null)}
            disabled={isSubmitting}
            className="border-gold text-gold hover:bg-gold/20"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClaim}
            disabled={!canAfford || isSubmitting}
            className={`${
              canAfford
                ? 'bg-gold text-dark hover:bg-gold/80'
                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? 'Claiming…' : 'Claim Cell'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
