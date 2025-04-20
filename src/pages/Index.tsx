
import React from 'react';
import { GameProvider } from '@/contexts/GameContext';
import MazeCanvas from '@/components/game/MazeCanvas';

const Index = () => {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-dark text-gold font-medieval">
        <h1 className="text-4xl text-center pt-5">𓋹 Pyrameme 𓋹</h1>
        <div className="flex flex-wrap justify-center gap-4 m-5">
          <div className="bg-black/70 p-4 border-2 border-gold rounded-lg">
            <span>𓃭 Score: 0</span>
          </div>
          <div className="bg-black/70 p-4 border-2 border-gold rounded-lg">
            <span>𓀙 High Score: 0</span>
          </div>
          <div className="bg-black/70 p-4 border-2 border-gold rounded-lg">
            <span>Wallet: 224 Kem</span>
          </div>
        </div>
        <MazeCanvas
          maze={[]}
          player={null}
          treasures={[]}
          exitCell={null}
          gridCells={[]}
          hintPaths={[]}
          onCellClick={() => {}}
        />
        <div className="flex flex-col items-center gap-4 mb-10">
          <button className="bg-brown text-gold border-2 border-gold px-6 py-2 rounded-lg hover:bg-brown/80 transition-colors">
            Hint (10 Kem)
          </button>
          <button className="bg-brown text-gold border-2 border-gold px-6 py-2 rounded-lg hover:bg-brown/80 transition-colors">
            𓀣 Share Your Victory
          </button>
          <button className="bg-brown text-gold border-2 border-gold px-6 py-2 rounded-lg hover:bg-brown/80 transition-colors">
            New Round
          </button>
        </div>
      </div>
    </GameProvider>
  );
};

export default Index;
