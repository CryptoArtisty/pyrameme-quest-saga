
import React from 'react';
import { GameProvider } from '@/contexts/game/GameContext';
import { GameContent } from '@/components/game/GameContent';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <GameProvider>
      <GameContent />
      <Toaster />
    </GameProvider>
  );
};

export default Index;
