
import { useEffect } from 'react';
import { GameStateType } from '../types';

interface UseGameTimerProps {
  gameState: GameStateType;
  startPlayPhase: () => void;
  handleGameOver: () => void;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
}

export const useGameTimer = ({ 
  gameState, 
  startPlayPhase, 
  handleGameOver,
  setGameState 
}: UseGameTimerProps) => {
  useEffect(() => {
    if (gameState.gameOver) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - gameState.startTime) / 1000);
      const phaseTime = gameState.phase === 'claim' ? 10 : 300;
      const remaining = Math.max(0, phaseTime - elapsed);
      
      setGameState(prev => ({
        ...prev,
        timeRemaining: remaining
      }));
      
      if (remaining <= 0) {
        if (gameState.phase === 'claim') {
          startPlayPhase();
        } else {
          handleGameOver();
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState.phase, gameState.startTime, gameState.gameOver, startPlayPhase, handleGameOver, setGameState]);
};

