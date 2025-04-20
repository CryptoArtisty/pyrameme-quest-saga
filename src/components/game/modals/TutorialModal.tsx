
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

const tutorialSteps = [
  {
    title: "Welcome to Pyrameme!",
    description: "A maze game with blockchain integration. Let's learn how to play!",
  },
  {
    title: "Claim Phase",
    description: "First, claim cells on the grid. Each regular cell costs 5 Pgl, corner cells cost 20 Pgl. You earn when other players land on your cells!",
  },
  {
    title: "Play Phase",
    description: "Navigate the maze, collect treasures, and reach the exit. Use arrow keys or click adjacent cells to move.",
  },
  {
    title: "Economy",
    description: "Earn Pgl by collecting treasures and reaching the exit quickly. Pay fees when landing on other players' cells. Buy more Pgl with WAX tokens.",
  },
  {
    title: "Ready to Play?",
    description: "Connect your WAX wallet to track your progress and compete on the leaderboard!",
  },
];

export const TutorialModal = () => {
  const { activeModal, showModal } = useGame();
  const [step, setStep] = React.useState(0);
  
  return (
    <Dialog open={activeModal === 'tutorial'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>{tutorialSteps[step].title}</DialogTitle>
          <DialogDescription className="text-sand">
            {tutorialSteps[step].description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => step > 0 ? setStep(step - 1) : showModal(null)}
            className="border-gold text-gold hover:bg-gold/20"
          >
            {step > 0 ? 'Previous' : 'Skip Tutorial'}
          </Button>
          <Button 
            onClick={() => step < tutorialSteps.length - 1 ? setStep(step + 1) : showModal(null)}
            className="bg-gold text-dark hover:bg-gold/80"
          >
            {step < tutorialSteps.length - 1 ? 'Next' : 'Start Playing'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
