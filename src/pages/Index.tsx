import React, { useEffect } from 'react';
import { GameProvider, useGame } from '@/contexts/GameContext';
import MazeCanvas from '@/components/game/MazeCanvas';
import { Menu, Wallet, Trophy, Share, LogIn } from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthProvider';

// Component for the claim modal
const ClaimModal = () => {
  const { activeModal, showModal, claimTarget, claimCell } = useGame();
  const [nickname, setNickname] = React.useState('');
  const [initials, setInitials] = React.useState('');

  const handleClaim = async () => {
    if (!claimTarget) return;
    const success = await claimCell(nickname, initials, claimTarget.col, claimTarget.row);
    if (success) {
      showModal(null);
    }
  };

  return (
    <Dialog open={activeModal === 'claim'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>Claim This Cell</DialogTitle>
          <DialogDescription className="text-sand">
            Enter your nickname and initials to claim this cell.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label htmlFor="nickname" className="text-sm font-medium text-gold">
              Nickname
            </label>
            <input
              id="nickname"
              className="w-full p-2 bg-dark border border-gold rounded-md text-gold"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="initials" className="text-sm font-medium text-gold">
              Initials (1-2 characters)
            </label>
            <input
              id="initials"
              className="w-full p-2 bg-dark border border-gold rounded-md text-gold"
              value={initials}
              onChange={(e) => setInitials(e.target.value.substring(0, 2))}
              maxLength={2}
            />
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
          <Button 
            onClick={handleClaim}
            disabled={!nickname || !initials}
            className="bg-gold text-dark hover:bg-gold/80"
          >
            Claim Cell
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Component for the victory modal
const VictoryModal = () => {
  const { activeModal, showModal, gameState, newRound } = useGame();
  
  return (
    <Dialog open={activeModal === 'victory'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle className="text-2xl">Victory!</DialogTitle>
          <DialogDescription className="text-sand text-lg">
            You've completed the maze!
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-sm text-sand">Score</p>
              <p className="text-2xl font-bold">{gameState.score}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-sand">High Score</p>
              <p className="text-2xl font-bold">{gameState.highScore}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-sand">Profit</p>
              <p className="text-2xl font-bold">{gameState.totalProfit}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-sand">Loss</p>
              <p className="text-2xl font-bold">{gameState.totalLoss}</p>
            </div>
          </div>
          {gameState.score > gameState.highScore && (
            <div className="text-center py-2">
              <p className="text-xl text-gold">New High Score!</p>
            </div>
          )}
        </div>
        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          <Button 
            onClick={() => {
              showModal(null);
              newRound();
            }}
            className="bg-gold text-dark hover:bg-gold/80 w-full sm:w-auto"
          >
            Play Again
          </Button>
          <Button 
            variant="outline"
            onClick={() => showModal('leaderboard')}
            className="border-gold text-gold hover:bg-gold/20 w-full sm:w-auto"
          >
            <Trophy className="mr-2 h-4 w-4" />
            Leaderboard
          </Button>
          <Button 
            variant="outline"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Pyrameme Game',
                  text: `I scored ${gameState.score} points in Pyrameme!`,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(
                  `I scored ${gameState.score} points in Pyrameme! Play at ${window.location.href}`
                );
                alert('Score copied to clipboard!');
              }
            }}
            className="border-gold text-gold hover:bg-gold/20 w-full sm:w-auto"
          >
            <Share className="mr-2 h-4 w-4" />
            Share Score
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Component for the tutorial modal
const TutorialModal = () => {
  const { activeModal, showModal } = useGame();
  const [step, setStep] = React.useState(0);
  
  const tutorialSteps = [
    {
      title: "Welcome to Pyrameme!",
      description: "A maze game with blockchain integration. Let's learn how to play!",
    },
    {
      title: "Claim Phase",
      description: "First, claim cells on the grid. Each regular cell costs 5 Pgl, corner cells cost 20 Pgl. You earn when other players land on your cells!",
    },
    {
      title: "Play Phase",
      description: "Navigate the maze, collect treasures, and reach the exit. Use arrow keys or click adjacent cells to move.",
    },
    {
      title: "Economy",
      description: "Earn Pgl by collecting treasures and reaching the exit quickly. Pay fees when landing on other players' cells. Buy more Pgl with WAX tokens.",
    },
    {
      title: "Ready to Play?",
      description: "Connect your WAX wallet to track your progress and compete on the leaderboard!",
    },
  ];
  
  return (
    <Dialog open={activeModal === 'tutorial'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>{tutorialSteps[step].title}</DialogTitle>
          <DialogDescription className="text-sand">
            {tutorialSteps[step].description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between">
          <Button 
            variant="outline"
            onClick={() => step > 0 ? setStep(step - 1) : showModal(null)}
            className="border-gold text-gold hover:bg-gold/20"
          >
            {step > 0 ? 'Previous' : 'Skip Tutorial'}
          </Button>
          <Button 
            onClick={() => step < tutorialSteps.length - 1 ? setStep(step + 1) : showModal(null)}
            className="bg-gold text-dark hover:bg-gold/80"
          >
            {step < tutorialSteps.length - 1 ? 'Next' : 'Start Playing'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Component for the leaderboard modal
const LeaderboardModal = () => {
  const { activeModal, showModal, leaderboard } = useGame();
  
  return (
    <Dialog open={activeModal === 'leaderboard'} onOpenChange={(open) => !open && showModal(null)}>
      <DialogContent className="bg-dark text-gold border-gold">
        <DialogHeader>
          <DialogTitle>Leaderboard</DialogTitle>
          <DialogDescription className="text-sand">
            Top players and their scores
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {leaderboard.length > 0 ? (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div key={index} className="flex justify-between items-center p-2 border border-gold/30 rounded-md">
                  <div className="flex items-center">
                    <span className="text-xl font-bold mr-4">{index + 1}</span>
                    <span>{entry.account}</span>
                  </div>
                  <span className="font-bold">{entry.score}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-sand">No scores recorded yet. Be the first!</p>
          )}
        </div>
        <DialogFooter>
          <Button 
            onClick={() => showModal(null)}
            className="bg-gold text-dark hover:bg-gold/80"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Main game component
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
    newRound,
    isMenuOpen,
    toggleMenu,
    isWalletConnected,
    connectWallet,
    buyPgl,
    showModal,
    claimTarget
  } = useGame();
  
  const { user } = useAuth();
  
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gradient-dark text-gold font-medieval">
      {/* Header */}
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

      {/* Game Stats */}
      <div className="flex flex-wrap justify-center gap-4 m-5">
        <Card className="bg-black/70 border-2 border-gold">
          <CardContent className="p-4">
            <span>𓃭 Score: {gameState.score}</span>
          </CardContent>
        </Card>
        <Card className="bg-black/70 border-2 border-gold">
          <CardContent className="p-4">
            <span>𓀙 High Score: {gameState.highScore}</span>
          </CardContent>
        </Card>
        <Card className="bg-black/70 border-2 border-gold">
          <CardContent className="p-4">
            <span>
              <Wallet className="inline mr-2 h-4 w-4" />
              {gameState.walletBalance} Pgl
            </span>
          </CardContent>
        </Card>
        <Card className="bg-black/70 border-2 border-gold">
          <CardContent className="p-4">
            <span>Phase: {gameState.phase} ({formatTime(gameState.timeRemaining)})</span>
          </CardContent>
        </Card>
      </div>

      {/* Game Canvas */}
      <MazeCanvas
        maze={maze}
        player={player}
        treasures={treasures}
        exitCell={exitCell}
        gridCells={gridCells}
        hintPaths={hintPaths}
        onCellClick={onCellClick}
      />

      {/* Bottom Action Buttons */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <Button 
          className="bg-brown text-gold border-2 border-gold px-6 py-2 rounded-lg hover:bg-brown/80 transition-colors"
          onClick={showHint}
        >
          Hint (10 Pgl)
        </Button>
        <Button 
          className="bg-brown text-gold border-2 border-gold px-6 py-2 rounded-lg hover:bg-brown/80 transition-colors"
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: 'Pyrameme Game',
                text: `I'm playing Pyrameme! Current score: ${gameState.score}`,
                url: window.location.href,
              });
            } else {
              navigator.clipboard.writeText(
                `I'm playing Pyrameme! Current score: ${gameState.score}. Play at ${window.location.href}`
              );
              alert('Link copied to clipboard!');
            }
          }}
        >
          𓀣 Share Your Game
        </Button>
        <Button 
          className="bg-brown text-gold border-2 border-gold px-6 py-2 rounded-lg hover:bg-brown/80 transition-colors"
          onClick={newRound}
        >
          New Round
        </Button>
        
        {!isWalletConnected && (
          <Button 
            className="bg-gold text-dark font-bold border-2 border-gold px-6 py-2 rounded-lg hover:bg-gold/80 transition-colors"
            onClick={connectWallet}
          >
            Connect WAX Wallet
          </Button>
        )}
      </div>

      {/* Sidebar Menu */}
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

      {/* Modals */}
      <ClaimModal />
      <VictoryModal />
      <TutorialModal />
      <LeaderboardModal />
      
      {/* Buy Pgl Modal */}
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
      
      {/* Terms Modal */}
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

      {/* Toast notifications are handled by the Toaster component */}
      <Toaster />
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
