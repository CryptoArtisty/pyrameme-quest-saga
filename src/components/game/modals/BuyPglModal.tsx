
import React from 'react';
import { useGame } from '@/contexts/game/GameContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export const BuyPglModal = () => {
  const { gameState, showModal, buyPgl } = useGame();

  return (
    <Dialog open={gameState.activeModal === 'buy'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>Buy Pgl</DialogTitle>
          <DialogDescription className="text-sand">
            Exchange WAX tokens for Pgl
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p>Exchange Rate: 1 WAX = 100 Pgl</p>
          <div className="flex flex-col space-y-2">
            <Button 
              onClick={() => buyPgl(1)}
              className="bg-gold text-dark hover:bg-gold/80"
            >
              Buy 100 Pgl (1 WAX)
            </Button>
            <Button 
              onClick={() => buyPgl(5)}
              className="bg-gold text-dark hover:bg-gold/80"
            >
              Buy 500 Pgl (5 WAX)
            </Button>
            <Button 
              onClick={() => buyPgl(10)}
              className="bg-gold text-dark hover:bg-gold/80"
            >
              Buy 1000 Pgl (10 WAX)
            </Button>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
