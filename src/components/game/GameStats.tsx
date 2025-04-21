
import React from 'react';
import { useGame } from '@/contexts/game/GameContext';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

const formatTime = (seconds: number) => {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  
  // Pad always, show MM:SS
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export const GameStats = () => {
  const { gameState } = useGame();

  return (
    <div className="flex flex-wrap justify-center gap-4 m-5">
      <Card className="bg-black/70 border-2 border-gold">
        <CardContent className="p-4">
          <span>𓃭 Score: {gameState.score}</span>
        </CardContent>
      </Card>
      <Card className="bg-black/70 border-2 border-gold">
        <CardContent className="p-4">
          <span>𓀙 High Score: {gameState.highScore}</span>
        </CardContent>
      </Card>
      <Card className="bg-black/70 border-2 border-gold">
        <CardContent className="p-4">
          <span>
            <Wallet className="inline mr-2 h-4 w-4" />
            {gameState.walletBalance} gold
          </span>
        </CardContent>
      </Card>
      <Card className="bg-black/70 border-2 border-gold">
        <CardContent className="p-4">
          <span>
            Phase: {gameState.phase} ({formatTime(gameState.timeRemaining)})
          </span>
        </CardContent>
      </Card>
    </div>
  );
};
