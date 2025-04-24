
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
    setGameState({
      ...defaultGameState,
      startTime: Date.now()
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
      title: "Game Initialized",
      description: "Claim your cells before time runs out!",
    });
  }, [defaultGameState, setGameState, setGridCells, setMaze, setPlayer, setTreasures, setExitCell, setClaimTarget, setActiveModal, toast]);

  const newRound = useCallback(() => {
    const currentGridCells = generateInitialGridCells();
    const startPosition = findPlayerStartPosition(currentGridCells);

    if (!startPosition) {
      toast({
        title: "No Starting Position",
        description: "You need to claim a cell first to start playing!",
      });
      setGameState(prev => ({
        ...defaultGameState,
        highScore: prev.highScore,
        walletBalance: prev.walletBalance,
        playerAccount: prev.playerAccount,
        playerWaxWallet: prev.playerWaxWallet,
        phase: 'claim',
        startTime: Date.now()
      }));
      return;
    }

    setGameState(prev => ({
      ...defaultGameState,
      highScore: prev.highScore,
      walletBalance: prev.walletBalance,
      playerAccount: prev.playerAccount,
      playerWaxWallet: prev.playerWaxWallet,
      phase: 'play',
      playerClaimed: true,
      startTime: Date.now()
    }));
    
    setGridCells(currentGridCells);
    setMaze([]);
    setPlayer(startPosition);
    setTreasures([]);
    setExitCell(null);
    setClaimTarget(null);
    
    toast({
      title: "New Round Started",
      description: "Find treasures and reach the exit!",
    });
  }, [defaultGameState, setGameState, setGridCells, setMaze, setPlayer, setTreasures, setExitCell, setClaimTarget, toast]);

  return {
    initializeGame,
    newRound
  };
};
