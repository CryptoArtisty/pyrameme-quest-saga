
import React from 'react';
import { useGame } from '@/contexts/GameContext';
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
  const { activeModal, showModal, claimTarget, claimCell } = useGame();
  const [nickname, setNickname] = React.useState('');
  const [initials, setInitials] = React.useState('');

  const handleClaim = async () => {
    if (!claimTarget) return;
    const success = await claimCell(nickname, initials, claimTarget.col, claimTarget.row);
    if (success) {
      showModal(null);
    }
  };

  return (
    <Dialog open={activeModal === 'claim'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>Claim This Cell</DialogTitle>
          <DialogDescription className="text-sand">
            Enter your nickname and initials to claim this cell.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium text-gold">
              Nickname
            </label>
            <input
              id="nickname"
              className="w-full p-2 bg-dark border border-gold rounded-md text-gold"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="initials" className="text-sm font-medium text-gold">
              Initials (1-2 characters)
            </label>
            <input
              id="initials"
              className="w-full p-2 bg-dark border border-gold rounded-md text-gold"
              value={initials}
              onChange={(e) => setInitials(e.target.value.substring(0, 2))}
              maxLength={2}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            variant="outline"
            onClick={() => showModal(null)}
            className="border-gold text-gold hover:bg-gold/20"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClaim}
            disabled={!nickname || !initials}
            className="bg-gold text-dark hover:bg-gold/80"
          >
            Claim Cell
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
