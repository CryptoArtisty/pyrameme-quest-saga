
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

export const LeaderboardModal = () => {
  const { activeModal, showModal, leaderboard } = useGame();
  
  return (
    <Dialog open={activeModal === 'leaderboard'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>Leaderboard</DialogTitle>
          <DialogDescription className="text-sand">
            Top players and their scores
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div key={index} className="flex justify-between items-center p-2 border border-gold/30 rounded-md">
                  <div className="flex items-center">
                    <span className="text-xl font-bold mr-4">{index + 1}</span>
                    <span>{entry.account}</span>
                  </div>
                  <span className="font-bold">{entry.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sand">No scores recorded yet. Be the first!</p>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={() => showModal(null)}
            className="bg-gold text-dark hover:bg-gold/80"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
