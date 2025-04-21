
import React from 'react';
import { GameProvider } from '@/contexts/game/GameContext';
import { GameContent } from '@/components/game/GameContent';

const Index = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Index;
