
import React, { useEffect } from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import MazeCanvas from '@/components/game/MazeCanvas';

const GameContent = () => {
  const { 
    maze, 
    player, 
    treasures, 
    exitCell, 
    gridCells, 
    hintPaths, 
    gameState, 
    onCellClick,
    initializeGame,
    showHint,
    newRound
  } = useGame();
  
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="min-h-screen bg-gradient-dark text-gold font-medieval">
      <h1 className="text-4xl text-center pt-5">𓋹 Pyrameme 𓋹</h1>
      <div className="flex flex-wrap justify-center gap-4 m-5">
        <div className="bg-black/70 p-4 border-2 border-gold rounded-lg">
          <span>𓃭 Score: {gameState.score}</span>
        </div>
        <div className="bg-black/70 p-4 border-2 border-gold rounded-lg">
          <span>𓀙 High Score: 0</span>
        </div>
        <div className="bg-black/70 p-4 border-2 border-gold rounded-lg">
          <span>Wallet: {gameState.walletBalance} Kem</span>
        </div>
      </div>
      <MazeCanvas
        maze={maze}
        player={player}
        treasures={treasures}
        exitCell={exitCell}
        gridCells={gridCells}
        hintPaths={hintPaths}
        onCellClick={onCellClick}
      />
      <div className="flex flex-col items-center gap-4 mb-10">
        <button 
          className="bg-brown text-gold border-2 border-gold px-6 py-2 rounded-lg hover:bg-brown/80 transition-colors"
          onClick={showHint}
        >
          Hint (10 Kem)
        </button>
        <button className="bg-brown text-gold border-2 border-gold px-6 py-2 rounded-lg hover:bg-brown/80 transition-colors">
          𓀣 Share Your Victory
        </button>
        <button 
          className="bg-brown text-gold border-2 border-gold px-6 py-2 rounded-lg hover:bg-brown/80 transition-colors"
          onClick={newRound}
        >
          New Round
        </button>
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
};

export default Index;
