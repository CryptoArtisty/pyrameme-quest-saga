import React, { createContext, useContext } from 'react';
import { GameContextType } from './types';
import { useGameState } from './useGameState';
import { useGameActions } from './hooks/useGameActions';
import { useGameTimer } from './hooks/useGameTimer';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { useWallet } from './hooks/useWallet';
import { useHint } from './hooks/useHint';
import { useCellClaim } from './hooks/useCellClaim';

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

  const { onCellClick } = useGameActions({
    gameState,
    player,
    maze,
    gridCells,
    setClaimTarget,
    setActiveModal,
    movePlayerToCell,
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

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const showModal = (modalName: string | null) => {
    setActiveModal(modalName);
  };

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
        initializeGame: () => {
          setGameState({
            ...defaultGameState,
            startTime: Date.now()
          });
          setGridCells(Array(15).fill(null).map(() => 
            Array(15).fill(null).map(() => ({ owner: null, nickname: "" }))
          ));
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
        },
        showHint,
        newRound: () => {
          setGameState(prev => ({
            ...defaultGameState,
            highScore: prev.highScore,
            walletBalance: prev.walletBalance,
            playerAccount: prev.playerAccount,
            playerWaxWallet: prev.playerWaxWallet,
            startTime: Date.now()
          }));
          setGridCells(Array(15).fill(null).map(() => 
            Array(15).fill(null).map(() => ({ owner: null, nickname: "" }))
          ));
          setMaze([]);
          setPlayer(null);
          setTreasures([]);
          setExitCell(null);
          setClaimTarget(null);
          toast({
            title: "New Round Started",
            description: "Claim your cells before time runs out!",
          });
        },
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
