
import React, { createContext, useContext, useEffect } from 'react';
import { GameContextType } from './types';
import { useGameState } from './useGameState';

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
    hintPaths, setHintPaths,
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

  useEffect(() => {
    if (gameState.gameOver) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - gameState.startTime) / 1000);
      const phaseTime = gameState.phase === 'claim' ? 10 : 300;
      const remaining = Math.max(0, phaseTime - elapsed);
      
      setGameState(prev => ({
        ...prev,
        timeRemaining: remaining
      }));
      
      if (remaining <= 0) {
        if (gameState.phase === 'claim') {
          startPlayPhase();
        } else {
          handleGameOver();
        }
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameState.phase, gameState.startTime, gameState.gameOver, startPlayPhase, handleGameOver]);

  const initializeGame = () => {
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
    setHintPaths([]);
    setClaimTarget(null);
    
    if (!localStorage.getItem('tutorialShown')) {
      setActiveModal('tutorial');
      localStorage.setItem('tutorialShown', 'true');
    }
    
    toast({
      title: "Game Initialized",
      description: "Claim your cells before time runs out!",
    });
  };

  const showHint = () => {
    if (gameState.phase !== 'play' || !player || !exitCell) return;
    
    if (gameState.walletBalance < 10) {
      toast({
        title: "Insufficient Funds",
        description: "You need 10 Pgl to get a hint.",
      });
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      walletBalance: prev.walletBalance - 10,
      totalLoss: prev.totalLoss + 10
    }));
    
    const hintPath: number[][] = [];
    const dx = exitCell.col - player.col;
    const dy = exitCell.row - player.row;
    const steps = Math.max(Math.abs(dx), Math.abs(dy));
    
    for (let i = 1; i <= steps; i++) {
      const progress = i / steps;
      const x = Math.round(player.col + dx * progress);
      const y = Math.round(player.row + dy * progress);
      hintPath.push([x, y]);
    }
    
    setHintPaths(hintPath);
    
    setTimeout(() => {
      setHintPaths([]);
    }, 3000);
    
    toast({
      title: "Hint Activated",
      description: "Path to exit shown briefly.",
    });
  };

  const movePlayerToCell = (col: number, row: number) => {
    const cell = gridCells[row][col];
    if (cell.owner && cell.owner !== gameState.playerAccount) {
      if (gameState.walletBalance < 5) {
        toast({
          title: "Insufficient Funds",
          description: "You need 5 Pgl to park on someone else's cell.",
        });
        return;
      }
      
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - 5,
        totalLoss: prev.totalLoss + 5
      }));
      
      toast({
        title: "Parking Fee Paid",
        description: `You paid 5 Pgl to ${cell.nickname}.`,
      });
    }
    
    const treasure = treasures.find(t => t.col === col && t.row === row && !t.collected);
    if (treasure) {
      setTreasures(prev => prev.map(t => 
        t.col === col && t.row === row ? { ...t, collected: true } : t
      ));
      
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance + treasure.value,
        score: prev.score + treasure.value,
        totalProfit: prev.totalProfit + treasure.value
      }));
      
      toast({
        title: "Treasure Found!",
        description: `You found ${treasure.value} Pgl!`,
      });
    }
    
    if (exitCell && col === exitCell.col && row === exitCell.row) {
      const timeBonus = Math.floor(gameState.timeRemaining * 0.5);
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + timeBonus,
        totalProfit: prev.totalProfit + timeBonus
      }));
      
      toast({
        title: "Exit Reached!",
        description: `Time bonus: ${timeBonus} points!`,
      });
      
      handleGameOver();
      return;
    }
    
    setPlayer({ col, row });
  };

  const movePlayer = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameState.phase !== 'play' || !player) return;
    
    let newCol = player.col;
    let newRow = player.row;
    
    switch (direction) {
      case 'up':
        newRow = Math.max(0, player.row - 1);
        break;
      case 'down':
        newRow = Math.min(14, player.row + 1);
        break;
      case 'left':
        newCol = Math.max(0, player.col - 1);
        break;
      case 'right':
        newCol = Math.min(14, player.col + 1);
        break;
    }
    
    if (newCol !== player.col || newRow !== player.row) {
      const currentCell = maze.find(cell => cell.col === player.col && cell.row === player.row);
      if (!currentCell) return;
      
      let canMove = true;
      if (direction === 'up' && currentCell.walls.top) canMove = false;
      if (direction === 'right' && currentCell.walls.right) canMove = false;
      if (direction === 'down' && currentCell.walls.bottom) canMove = false;
      if (direction === 'left' && currentCell.walls.left) canMove = false;
      
      if (canMove) {
        movePlayerToCell(newCol, newRow);
      }
    }
  };

  const onCellClick = (col: number, row: number) => {
    if (gameState.gameOver) return;
    
    if (gameState.phase === 'claim') {
      const isClaimed = gridCells[row][col].owner !== null;
      if (isClaimed) {
        toast({
          title: "Cell Already Claimed",
          description: "This cell is already owned by someone.",
        });
        return;
      }
      
      const isCorner = (row === 0 || row === 14) && (col === 0 || col === 14);
      const cost = isCorner ? 20 : 5;
      
      if (gameState.walletBalance < cost) {
        toast({
          title: "Insufficient Funds",
          description: `You need ${cost} Pgl to claim this cell.`,
        });
        return;
      }
      
      setClaimTarget({col, row});
      setActiveModal("claim");
    } else if (gameState.phase === 'play' && player) {
      const dx = Math.abs(col - player.col);
      const dy = Math.abs(row - player.row);
      
      if ((dx === 1 && dy === 0) || (dx === 0 && dy === 1)) {
        const currentCell = maze.find(cell => cell.col === player.col && cell.row === player.row);
        if (!currentCell) return;
        
        let canMove = true;
        
        if (canMove) {
          movePlayerToCell(col, row);
        } else {
          toast({
            title: "Can't Move There",
            description: "There's a wall in the way!",
          });
        }
      }
    }
  };

  const connectWallet = async (): Promise<boolean> => {
    try {
      toast({
        title: "Connecting Wallet...",
        description: "Please approve the connection request in your wallet.",
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsWalletConnected(true);
      setGameState(prev => ({
        ...prev,
        playerWaxWallet: "waxwallet.example",
        playerAccount: "example.wam"
      }));
      
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to your WAX wallet.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Could not connect to WAX wallet.",
      });
      return false;
    }
  };

  const buyPgl = async (amount: number): Promise<boolean> => {
    try {
      if (!isWalletConnected) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your WAX wallet first.",
        });
        return false;
      }
      
      toast({
        title: "Processing Transaction...",
        description: `Sending ${amount} WAX to buy ${amount * 100} Pgl`,
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance + (amount * 100)
      }));
      
      toast({
        title: "Transaction Complete",
        description: `Successfully purchased ${amount * 100} Pgl!`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Could not complete the Pgl purchase.",
      });
      return false;
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev);
  };

  const showModal = (modalName: string | null) => {
    setActiveModal(modalName);
  };

  const claimCell = async (nickname: string, initials: string, col: number, row: number): Promise<boolean> => {
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

  useEffect(() => {
    if (gameState.phase !== 'play') return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.phase !== 'play' || !player) return;
      
      switch (e.key) {
        case 'ArrowUp':
          movePlayer('up');
          break;
        case 'ArrowDown':
          movePlayer('down');
          break;
        case 'ArrowLeft':
          movePlayer('left');
          break;
        case 'ArrowRight':
          movePlayer('right');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.phase, player]);

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
