
import React from 'react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { Trophy, Share } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export const VictoryModal = () => {
  const { activeModal, showModal, gameState, newRound } = useGame();
  
  return (
    <Dialog open={activeModal === 'victory'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle className="text-2xl">Victory!</DialogTitle>
          <DialogDescription className="text-sand text-lg">
            You've completed the maze!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-sand">Score</p>
              <p className="text-2xl font-bold">{gameState.score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-sand">High Score</p>
              <p className="text-2xl font-bold">{gameState.highScore}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-sand">Profit</p>
              <p className="text-2xl font-bold">{gameState.totalProfit}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-sand">Loss</p>
              <p className="text-2xl font-bold">{gameState.totalLoss}</p>
            </div>
          </div>
          {gameState.score > gameState.highScore && (
            <div className="text-center py-2">
              <p className="text-xl text-gold">New High Score!</p>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          <Button 
            onClick={() => {
              showModal(null);
              newRound();
            }}
            className="bg-gold text-dark hover:bg-gold/80 w-full sm:w-auto"
          >
            Play Again
          </Button>
          <Button 
            variant="outline"
            onClick={() => showModal('leaderboard')}
            className="border-gold text-gold hover:bg-gold/20 w-full sm:w-auto"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Pyrameme Game',
                  text: `I scored ${gameState.score} points in Pyrameme!`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(
                  `I scored ${gameState.score} points in Pyrameme! Play at ${window.location.href}`
                );
                alert('Score copied to clipboard!');
              }
            }}
            className="border-gold text-gold hover:bg-gold/20 w-full sm:w-auto"
          >
            <Share className="mr-2 h-4 w-4" />
            Share Score
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
