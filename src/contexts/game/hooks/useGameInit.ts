
import { useState, useCallback } from 'react';
import { GameStateType } from '../types';
import { Cell, PlayerPosition, Treasure, GridCell } from '@/types/game';
import { generateInitialGridCells } from '../gameUtils';

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
  const initializeGame = useCallback(() => {
    setGameState({
      ...defaultGameState,
      startTime: Date.now()
    });
    
    setGridCells(generateInitialGridCells());
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
      title: "Game Initialized",
      description: "Claim your cells before time runs out!",
    });
  }, [defaultGameState, setGameState, setGridCells, setMaze, setPlayer, setTreasures, setExitCell, setClaimTarget, setActiveModal, toast]);

  const newRound = useCallback(() => {
    setGameState(prev => ({
      ...defaultGameState,
      highScore: prev.highScore,
      walletBalance: prev.walletBalance,
      playerAccount: prev.playerAccount,
      playerWaxWallet: prev.playerWaxWallet,
      startTime: Date.now()
    }));
    
    setGridCells(generateInitialGridCells());
    setMaze([]);
    setPlayer(null);
    setTreasures([]);
    setExitCell(null);
    setClaimTarget(null);
    
    toast({
      title: "New Round Started",
      description: "Claim your cells before time runs out!",
    });
  }, [defaultGameState, setGameState, setGridCells, setMaze, setPlayer, setTreasures, setExitCell, setClaimTarget, toast]);

  return {
    initializeGame,
    newRound
  };
};
