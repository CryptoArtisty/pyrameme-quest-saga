
import React from 'react';
import { useGame } from '@/contexts/game/GameContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

export const TermsModal = () => {
  const { gameState, showModal } = useGame();

  return (
    <Dialog open={gameState.activeModal === 'terms'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>Terms & Conditions</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <p>By playing Pyrameme, you agree to the following terms:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>All transactions are final and non-refundable.</li>
            <li>Pgl tokens have no real-world value and are for in-game use only.</li>
            <li>Game performance may vary based on network conditions.</li>
            <li>We reserve the right to modify game mechanics at any time.</li>
            <li>User data is stored according to our privacy policy.</li>
            <li>Blockchain transactions require WAX wallet and may incur network fees.</li>
          </ul>
        </div>
        <DialogFooter>
          <Button 
            onClick={() => showModal(null)}
            className="bg-gold text-dark hover:bg-gold/80"
          >
            I Understand
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
