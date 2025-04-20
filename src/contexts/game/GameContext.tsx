import React, { createContext, useContext } from 'react';
import { GameContextType } from './types';
import { useGameState } from './useGameState';
import { useGameActions } from './hooks/useGameActions';
import { useGameTimer } from './hooks/useGameTimer';
import { usePlayerMovement } from './hooks/usePlayerMovement';
import { useWallet } from './hooks/useWallet';
import { useHint } from './hooks/useHint';

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

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const showModal = (modalName: string | null) => {
    setActiveModal(modalName);
  };

  const claimCell = async (nickname: string, initials: string) => {
    if (!claimTarget) return false;
    
    try {
      const { col, row } = claimTarget;
      
      const isCorner = (row === 0 || row === 14) && (col === 0 || col === 14);
      const cost = isCorner ? 20 : 5;
      
      if (gameState.walletBalance < cost) {
        toast({
          title: "Insufficient Funds",
          description: `You need ${cost} Pgl to claim this cell.`,
        });
        return false;
      }
      
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - cost,
        totalLoss: prev.totalLoss + cost,
        playerNickname: nickname,
        playerClaimed: true
      }));
      
      setGridCells(prev => {
        const newGrid = [...prev];
        newGrid[row][col] = {
          owner: gameState.playerAccount || 'local-player',
          nickname: initials
        };
        return newGrid;
      });
      
      setClaimTarget(null);
      setActiveModal(null);
      
      toast({
        title: "Cell Claimed!",
        description: `You've successfully claimed this cell for ${cost} Pgl.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Claim Failed",
        description: "Could not claim the cell.",
      });
      return false;
    }
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
