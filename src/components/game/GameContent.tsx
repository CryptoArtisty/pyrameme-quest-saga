
import React, { useEffect } from 'react';
import { useGame } from '@/contexts/game/GameContext';
import { Menu, LogIn } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthProvider';
import { ClaimModal } from '@/components/game/modals/ClaimModal';
import { VictoryModal } from '@/components/game/modals/VictoryModal';
import { TutorialModal } from '@/components/game/modals/TutorialModal';
import { LeaderboardModal } from '@/components/game/modals/LeaderboardModal';
import { GameStats } from '@/components/game/GameStats';
import { GameActions } from '@/components/game/GameActions';
import { Trophy } from 'lucide-react';
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
    isMenuOpen,
    toggleMenu,
    showModal,
    buyPgl,
    gameState
  } = useGame();
  
  const { user } = useAuth();
  
  useEffect(() => {
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

      <Sheet open={isMenuOpen} onOpenChange={toggleMenu}>
        <SheetContent className="bg-dark border-l border-gold">
          <SheetHeader>
            <SheetTitle className="text-gold">Menu</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {!user && (
              <Button 
                variant="outline" 
                className="w-full border-gold text-gold justify-start"
                asChild
              >
                <Link to="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Login / Sign Up
                </Link>
              </Button>
            )}
            <Button 
              variant="outline" 
              className="w-full border-gold text-gold justify-start"
              onClick={() => {
                showModal('tutorial');
                toggleMenu();
              }}
            >
              Tutorial
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-gold text-gold justify-start"
              onClick={() => {
                showModal('buy');
                toggleMenu();
              }}
            >
              Buy Pgl
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-gold text-gold justify-start"
              onClick={() => {
                showModal('leaderboard');
                toggleMenu();
              }}
            >
              <Trophy className="mr-2 h-4 w-4" />
              Leaderboard
            </Button>
            <Button 
              variant="outline" 
              className="w-full border-gold text-gold justify-start"
              onClick={() => {
                showModal('terms');
                toggleMenu();
              }}
            >
              Terms & Conditions
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <ClaimModal />
      <VictoryModal />
      <TutorialModal />
      <LeaderboardModal />
      
      <Dialog open={gameState.activeModal === 'buy'} onOpenChange={(open) => !open && showModal(null)}>
        <DialogContent className="bg-dark text-gold border-gold">
          <DialogHeader>
            <DialogTitle>Buy Pgl</DialogTitle>
            <DialogDescription className="text-sand">
              Exchange WAX tokens for Pgl
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p>Exchange Rate: 1 WAX = 100 Pgl</p>
            <div className="flex flex-col space-y-2">
              <Button 
                onClick={() => buyPgl(1)}
                className="bg-gold text-dark hover:bg-gold/80"
              >
                Buy 100 Pgl (1 WAX)
              </Button>
              <Button 
                onClick={() => buyPgl(5)}
                className="bg-gold text-dark hover:bg-gold/80"
              >
                Buy 500 Pgl (5 WAX)
              </Button>
              <Button 
                onClick={() => buyPgl(10)}
                className="bg-gold text-dark hover:bg-gold/80"
              >
                Buy 1000 Pgl (10 WAX)
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => showModal(null)}
              className="border-gold text-gold hover:bg-gold/20"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={gameState.activeModal === 'terms'} onOpenChange={(open) => !open && showModal(null)}>
        <DialogContent className="bg-dark text-gold border-gold">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
            <p>By playing Pyrameme, you agree to the following terms:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>All transactions are final and non-refundable.</li>
              <li>Pgl tokens have no real-world value and are for in-game use only.</li>
              <li>Game performance may vary based on network conditions.</li>
              <li>We reserve the right to modify game mechanics at any time.</li>
              <li>User data is stored according to our privacy policy.</li>
              <li>Blockchain transactions require WAX wallet and may incur network fees.</li>
            </ul>
          </div>
          <DialogFooter>
            <Button 
              onClick={() => showModal(null)}
              className="bg-gold text-dark hover:bg-gold/80"
            >
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
