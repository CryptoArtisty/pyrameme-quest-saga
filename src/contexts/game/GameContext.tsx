
import React, { createContext, useContext, useEffect } from 'react';
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
import { useActiveGame } from './hooks/useActiveGame';

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

  // We still use our local timer for game mechanics
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
    isMenuOpen,
    setIsMenuOpen,
    toast
  });

  // Use shared active game state (all players see the same one)
  const { sharedGame } = useActiveGame();

  // Sync the shared game data to our local state
  useEffect(() => {
    if (sharedGame) {
      // Update maze
      if (sharedGame.maze && sharedGame.maze.length > 0) {
        setMaze(sharedGame.maze);
      }
      
      // Update treasures
      if (sharedGame.treasures && sharedGame.treasures.length > 0) {
        setTreasures(sharedGame.treasures);
      }
      
      // Update exit cell
      if (sharedGame.exitCell) {
        setExitCell(sharedGame.exitCell);
      }
      
      // Update phase and timing information
      setGameState(prev => ({
        ...prev,
        phase: sharedGame.phase,
        startTime: sharedGame.startTime,
        // We'll calculate timeRemaining in the next useEffect
      }));
    }
  }, [sharedGame, setMaze, setTreasures, setExitCell, setGameState]);

  // Calculate and update time remaining based on shared game data
  useEffect(() => {
    if (!sharedGame) return;
    
    const updateTimeRemaining = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - sharedGame.startTime) / 1000);
      const timeLeft = Math.max(0, sharedGame.timerDuration - elapsed);
      
      setGameState(prev => ({
        ...prev,
        timeRemaining: timeLeft
      }));
    };
    
    // Update immediately and then set interval
    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [sharedGame, setGameState]);

  // Use shared game data when available, fallback to local state
  const effectiveMaze = sharedGame?.maze && sharedGame.maze.length > 0 ? sharedGame.maze : maze;
  const effectiveTreasures = sharedGame?.treasures && sharedGame.treasures.length > 0 ? sharedGame.treasures : treasures;
  const effectiveExitCell = sharedGame?.exitCell || exitCell;
  const effectivePhase = sharedGame?.phase || gameState.phase;
  
  return (
    <GameContext.Provider
      value={{
        maze: effectiveMaze,
        player,
        treasures: effectiveTreasures,
        exitCell: effectiveExitCell,
        gridCells,
        hintPaths,
        gameState: {
          ...gameState,
          phase: effectivePhase,
        },
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
