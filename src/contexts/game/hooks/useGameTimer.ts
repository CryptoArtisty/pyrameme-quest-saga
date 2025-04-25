
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
    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - gameState.startTime) / 1000);
      const phaseTime = gameState.phase === 'claim' ? 10 : 120; // 2 minutes for play phase
      const remaining = Math.max(0, phaseTime - elapsed);
      
      setGameState(prev => ({
        ...prev,
        timeRemaining: remaining
      }));
      
      if (remaining <= 0) {
        if (gameState.phase === 'claim') {
          console.log("Claim phase ended, starting play phase");
          startPlayPhase();
        } else {
          console.log("Play phase ended, starting new round with claim phase");
          setGameState(prev => ({
            ...prev,
            phase: 'claim',
            playerClaimed: false,
            startTime: Date.now(),
            timeRemaining: 10,
            gameOver: false
          }));
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState.phase, gameState.startTime, startPlayPhase, handleGameOver, setGameState]);
};
