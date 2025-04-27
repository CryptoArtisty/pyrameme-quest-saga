
import { useEffect } from 'react';
import { GameStateType } from '../types';
import { generateInitialGridCells } from '../gameUtils';
import { Cell, PlayerPosition, Treasure, GridCell } from '@/types/game';

interface UseGameTimerProps {
  gameState: GameStateType;
  startPlayPhase: () => void;
  handleGameOver: () => void;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  setGridCells: (cells: React.SetStateAction<GridCell[][]>) => void;
  setMaze: (maze: Cell[]) => void;
  setPlayer: (player: React.SetStateAction<PlayerPosition | null>) => void;
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
            
            // Before starting play phase, make sure to store the player's claim status
            if (!gameState.playerClaimed) {
              // If player has not claimed in this round, update their token appearance
              // Fixed: Don't use a function setter here, use a conditional to prepare the new value
              const playerUpdate = player => {
                if (!player) return null;
                return {
                  ...player,
                  hasClaimed: false // Player hasn't claimed in current game
                  // Keep hasClaimedEver as it was
                };
              };
              
              // Use the function with setPlayer but correctly
              setPlayer(prev => {
                if (!prev) return null;
                return {
                  ...prev,
                  hasClaimed: false 
                };
              });
            }
            
            // Always transition to play phase, regardless of whether a player claimed a cell
            startPlayPhase();
          } else if (gameState.phase === 'play') {
            console.log("Play phase ended, starting countdown");
            
            // Keep existing claimed cells
            setGridCells(prev => {
              // Deep copy initial grid cells
              const initialGridCells = generateInitialGridCells();
              const newCells = JSON.parse(JSON.stringify(initialGridCells));
              
              // Copy over any claimed cells from previous grid
              for (let row = 0; row < prev.length; row++) {
                if (!prev[row]) continue;
                for (let col = 0; col < prev[row].length; col++) {
                  if (prev[row][col] && prev[row][col].owner) {
                    if (!newCells[row]) newCells[row] = [];
                    newCells[row][col] = { ...prev[row][col] };
                  }
                }
              }
              
              return newCells;
            });
            
            // Clear maze but don't reset player position - that stays at claimed cell
            setMaze([]);
            setTreasures([]);
            setExitCell(null);
            
            setGameState(prev => ({
              ...prev,
              phase: 'countdown',
              countdownValue: 3,
              score: 0 // Reset score for new round
            }));
          }
        }
      }, 1000);
    }
    
    return () => clearInterval(timer);
  }, [gameState.phase, gameState.startTime, gameState.playerClaimed, startPlayPhase, handleGameOver, setGameState, setGridCells, setMaze, setPlayer, setTreasures, setExitCell]);
};
