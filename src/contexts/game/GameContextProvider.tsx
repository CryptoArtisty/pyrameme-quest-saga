import React from 'react';
import GameContext from './GameContext';
import { useGameState } from './useGameState';
import { useGameActions } from './hooks/useGameActions';
import { useGameTimer } from './hooks/useGameTimer';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { useWallet } from './hooks/useWallet';
import { useHint } from './hooks/useHint';
import { useCellClaim } from './hooks/useCellClaim';
import { useGameInit } from './hooks/useGameInit';
import { useGameMechanics } from './hooks/useGameMechanics';
import { useGameSync } from './hooks/useGameSync';

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gameState = useGameState();
  const {
    maze, setMaze,
    player, setPlayer,
    treasures, setTreasures,
    exitCell, setExitCell,
    gridCells, setGridCells,
    gameState: state, setGameState,
    achievements,
    leaderboard,
    isWalletConnected, setIsWalletConnected,
    isMenuOpen, setIsMenuOpen,
    activeModal, setActiveModal,
    claimTarget, setClaimTarget,
    startPlayPhase,
    handleGameOver,
    defaultGameState,
    toast
  } = gameState;

  // Use the new sync hook
  useGameSync();

  const { movePlayer, movePlayerToCell } = usePlayerMovement({
    gameState: state,
    player,
    maze,
    gridCells,
    treasures,
    exitCell,
    setPlayer,
    setGameState,
    setTreasures,
    handleGameOver,
    toast
  });

  // Keep existing hook initializations
  useGameTimer({
    gameState: state,
    startPlayPhase,
    handleGameOver,
    setGameState
  });

  const { connectWallet, buyPgl, convertGoldToPGL } = useWallet({
    isWalletConnected,
    gameState: state,
    setIsWalletConnected,
    setGameState,
    toast
  });

  const { hintPaths, showHint } = useHint({
    gameState: state,
    player,
    exitCell,
    setGameState,
    toast
  });

  const { claimCell } = useCellClaim({
    gameState: state,
    setGameState,
    setGridCells,
    setClaimTarget,
    setActiveModal,
    toast
  });

  const { initializeGame, newRound } = useGameInit({
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
  });

  const { onCellClick, toggleMenu, showModal } = useGameMechanics({
    gameState: state,
    player,
    maze,
    gridCells,
    setClaimTarget,
    setActiveModal,
    movePlayerToCell,
    isMenuOpen,
    setIsMenuOpen,
    toast
  });

  const contextValue = {
    maze,
    player,
    treasures,
    exitCell,
    gridCells,
    hintPaths,
    gameState: state,
    achievements,
    leaderboard,
    isWalletConnected,
    isMenuOpen,
    activeModal,
    claimTarget,
    onCellClick,
    initializeGame,
    showHint,
    newRound,
    movePlayer,
    connectWallet,
    buyPgl,
    convertGoldToPGL,
    toggleMenu,
    showModal,
    claimCell,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};
