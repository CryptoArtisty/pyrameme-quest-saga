
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
import { useMenuModal } from './hooks/useMenuModal';
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

  // Use the game sync hook
  useGameSync();

  // Debug logging for player state changes
  React.useEffect(() => {
    console.log("Player state changed:", player);
  }, [player]);

  // Debug logging for game state changes
  React.useEffect(() => {
    console.log("Game state changed:", state);
  }, [state]);

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

  // Use the game timer hook with all required props
  useGameTimer({
    gameState: state,
    startPlayPhase,
    handleGameOver,
    setGameState,
    setGridCells,
    setMaze,
    setPlayer,
    setTreasures,
    setExitCell
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
    setPlayer,
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

  // Use the game actions hook for cell clicks
  const { onCellClick } = useGameActions({
    gameState: state,
    player,
    maze,
    gridCells,
    setClaimTarget,
    setActiveModal,
    movePlayerToCell,
    toast
  });

  const { toggleMenu, showModal } = useMenuModal({
    isMenuOpen,
    setIsMenuOpen,
    setActiveModal
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
      {state.phase === 'countdown' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-9xl font-bold text-gold animate-pulse">
            {state.countdownValue}
          </div>
        </div>
      )}
      {children}
    </GameContext.Provider>
  );
};
