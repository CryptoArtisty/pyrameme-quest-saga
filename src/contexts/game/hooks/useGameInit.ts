import { useState, useCallback } from 'react';
import { GameStateType } from '../types';
import { Cell, PlayerPosition, Treasure, GridCell } from '@/types/game';
import { generateInitialGridCells, generateMaze, generateRandomStartPosition, generateTreasures, generateRandomExit } from '../gameUtils';

interface UseGameInitProps {
  defaultGameState: GameStateType;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  setGridCells: (cells: GridCell[][]) => void;
  setMaze: (maze: Cell[]) => void;
  setPlayer: (player: PlayerPosition | null) => void;
  setTreasures: (treasures: Treasure[]) => void;
  setExitCell: (cell: { col: number; row: number } | null) => void;
  setClaimTarget: (target: { col: number; row: number } | null) => void;
  setActiveModal: (modal: string | null) => void;
  toast: any;
}

export const useGameInit = ({
  defaultGameState,
  setGameState,
  setGridCells,
  setMaze,
  setPlayer,
  setTreasures,
  setExitCell,
  setClaimTarget,
  setActiveModal,
  toast
}: UseGameInitProps) => {
  const findPlayerStartPosition = (gridCells: GridCell[][]): PlayerPosition | null => {
    for (let row = 0; row < gridCells.length; row++) {
      for (let col = 0; col < gridCells[row].length; col++) {
        const cell = gridCells[row][col];
        if (cell.owner === defaultGameState.playerAccount) {
          return { col, row };
        }
      }
    }
    return null;
  };

  const initializeGame = useCallback(() => {
    console.log("Initializing new game");
    setGameState({
      ...defaultGameState,
      phase: 'claim',
      playerClaimed: false,
      startTime: Date.now(),
      gameOver: false
    });
    
    const initialGridCells = generateInitialGridCells();
    setGridCells(initialGridCells);
    setMaze([]);
    setPlayer(null);
    setTreasures([]);
    setExitCell(null);
    setClaimTarget(null);
    
    if (!localStorage.getItem('tutorialShown')) {
      setActiveModal('tutorial');
      localStorage.setItem('tutorialShown', 'true');
    }
    
    toast({
      title: "New Game Started",
      description: "Claim your cells before time runs out!",
    });
  }, [defaultGameState, setGameState, setGridCells, setMaze, setPlayer, setTreasures, setExitCell, setClaimTarget, setActiveModal, toast]);

  const newRound = useCallback(() => {
    console.log("Starting new round with claim phase");
    const initialGridCells = generateInitialGridCells();
    setGridCells(initialGridCells);
    setMaze([]);
    setPlayer(null);
    setTreasures([]);
    setExitCell(null);
    setClaimTarget(null);
    setActiveModal(null);

    setGameState(prev => ({
      ...defaultGameState,
      highScore: prev.highScore,
      walletBalance: prev.walletBalance,
      playerAccount: prev.playerAccount,
      playerWaxWallet: prev.playerWaxWallet,
      phase: 'claim',
      playerClaimed: false,
      startTime: Date.now(),
      gameOver: false
    }));
    
    toast({
      title: "New Round Started",
      description: "Claim your cells before time runs out!",
    });
  }, [defaultGameState, setGameState, setGridCells, setMaze, setPlayer, setTreasures, setExitCell, setClaimTarget, setActiveModal, toast]);

  return {
    initializeGame,
    newRound
  };
};
