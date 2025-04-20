import React, { createContext, useContext } from 'react';
import { GameContextType } from './types';
import { useGameState } from './useGameState';
import { useGameActions } from './hooks/useGameActions';
import { useGameTimer } from './hooks/useGameTimer';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { useWallet } from './hooks/useWallet';
import { useHint } from './hooks/useHint';
import { useCellClaim } from './hooks/useCellClaim';
import { useGameInit } from './hooks/useGameInit';
import { useGameMechanics } from './hooks/useGameMechanics';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

interface GameProviderProps {
  children: React.ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const {
    maze, setMaze,
    player, setPlayer,
    treasures, setTreasures,
    exitCell, setExitCell,
    gridCells, setGridCells,
    gameState, setGameState,
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
  } = useGameState();

  const { movePlayer, movePlayerToCell } = usePlayerMovement({
    gameState,
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

  useGameTimer({
    gameState,
    startPlayPhase,
    handleGameOver,
    setGameState
  });

  const { connectWallet, buyPgl } = useWallet({
    isWalletConnected,
    setIsWalletConnected,
    setGameState,
    toast
  });

  const { hintPaths, showHint } = useHint({
    gameState,
    player,
    exitCell,
    setGameState,
    toast
  });

  const { claimCell } = useCellClaim({
    gameState,
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
    gameState,
    player,
    maze,
    gridCells,
    setClaimTarget,
    setActiveModal,
    movePlayerToCell,
    toast
  });

  return (
    <GameContext.Provider
      value={{
        maze,
        player,
        treasures,
        exitCell,
        gridCells,
        hintPaths,
        gameState,
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
        toggleMenu,
        showModal,
        claimCell,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export default GameContext;
