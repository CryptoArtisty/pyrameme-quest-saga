
import { useEffect } from 'react';
import { GameStateType } from '../types';
import { generateInitialGridCells } from '../gameUtils';
import { Cell, PlayerPosition, Treasure, GridCell } from '@/types/game';

interface UseGameTimerProps {
  gameState: GameStateType;
  startPlayPhase: () => void;
  handleGameOver: () => void;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  setGridCells: (cells: GridCell[][]) => void;
  setMaze: (maze: Cell[]) => void;
  setPlayer: (player: PlayerPosition | null) => void;
  setTreasures: (treasures: Treasure[]) => void;
  setExitCell: (cell: { col: number; row: number } | null) => void;
}

export const useGameTimer = ({ 
  gameState, 
  startPlayPhase, 
  handleGameOver,
  setGameState,
  setGridCells,
  setMaze,
  setPlayer,
  setTreasures,
  setExitCell
}: UseGameTimerProps) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState.phase === 'countdown') {
      timer = setInterval(() => {
        setGameState(prev => {
          const newCountdown = (prev.countdownValue || 3) - 1;
          
          if (newCountdown <= 0) {
            return {
              ...prev,
              phase: 'claim',
              playerClaimed: false,
              startTime: Date.now(),
              timeRemaining: 10,
              countdownValue: undefined
            };
          }
          
          return {
            ...prev,
            countdownValue: newCountdown
          };
        });
      }, 1000);
    } else {
      timer = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - gameState.startTime) / 1000);
        const phaseTime = gameState.phase === 'claim' ? 10 : 120;
        const remaining = Math.max(0, phaseTime - elapsed);
        
        setGameState(prev => ({
          ...prev,
          timeRemaining: remaining
        }));
        
        if (remaining <= 0) {
          if (gameState.phase === 'claim') {
            console.log("Claim phase ended, starting play phase");
            startPlayPhase();
          } else if (gameState.phase === 'play') {
            console.log("Play phase ended, starting countdown");
            const initialGridCells = generateInitialGridCells();
            setGridCells(initialGridCells);
            setMaze([]);
            setPlayer(null);
            setTreasures([]);
            setExitCell(null);
            
            setGameState(prev => ({
              ...prev,
              phase: 'countdown',
              countdownValue: 3
            }));
          }
        }
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [gameState.phase, gameState.startTime, startPlayPhase, handleGameOver, setGameState, setGridCells, setMaze, setPlayer, setTreasures, setExitCell]);
};
