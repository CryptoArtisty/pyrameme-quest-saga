
import React from 'react';
import { useGame } from '@/contexts/game/GameContext';
import { Menu, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';
import { ClaimModal } from '@/components/game/modals/ClaimModal';
import { VictoryModal } from '@/components/game/modals/VictoryModal';
import { TutorialModal } from '@/components/game/modals/TutorialModal';
import { LeaderboardModal } from '@/components/game/modals/LeaderboardModal';
import { BuyPglModal } from '@/components/game/modals/BuyPglModal';
import { TermsModal } from '@/components/game/modals/TermsModal';
import { GameMenu } from '@/components/game/GameMenu';
import { GameStats } from '@/components/game/GameStats';
import { GameActions } from '@/components/game/GameActions';
import MazeCanvas from '@/components/game/MazeCanvas';

export const GameContent = () => {
  const { 
    maze, 
    player, 
    treasures, 
    exitCell, 
    gridCells, 
    hintPaths,
    onCellClick,
    initializeGame,
    toggleMenu
  } = useGame();
  
  const { user } = useAuth();

  React.useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  return (
    <div className="min-h-screen bg-gradient-dark text-gold font-medieval">
      <header className="p-4 flex justify-between items-center">
        <button onClick={toggleMenu} className="bg-brown p-2 rounded-lg">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-4xl text-center">𓋹 Pyrameme 𓋹</h1>
        <div className="w-10">
          {!user && (
            <Link to="/auth">
              <Button variant="ghost" size="icon">
                <LogIn className="h-6 w-6" />
              </Button>
            </Link>
          )}
        </div>
      </header>

      <GameStats />

      <MazeCanvas
        maze={maze}
        player={player}
        treasures={treasures}
        exitCell={exitCell}
        gridCells={gridCells}
        hintPaths={hintPaths}
        onCellClick={onCellClick}
      />

      <GameActions />
      
      <GameMenu />
      <ClaimModal />
      <VictoryModal />
      <TutorialModal />
      <LeaderboardModal />
      <BuyPglModal />
      <TermsModal />
    </div>
  );
};
