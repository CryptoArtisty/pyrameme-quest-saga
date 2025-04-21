
import React from 'react';
import { useGame } from '@/contexts/game/GameContext';
import { Button } from '@/components/ui/button';

export const GameActions = () => {
  const { gameState, showHint, newRound, isWalletConnected, connectWallet, showModal } = useGame();

  return (
    <div className="flex flex-col items-center gap-4 mb-10">
      <Button 
        className="bg-brown text-gold border-2 border-gold px-6 py-2 rounded-lg hover:bg-brown/80 transition-colors"
        onClick={showHint}
      >
        Hint (1000 gold)
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
      
      {isWalletConnected ? (
        <Button 
          className="bg-gold text-dark font-bold border-2 border-gold px-6 py-2 rounded-lg hover:bg-gold/80 transition-colors"
          onClick={() => showModal('buy')}
        >
          Buy More Gold
        </Button>
      ) : (
        <Button 
          className="bg-gold text-dark font-bold border-2 border-gold px-6 py-2 rounded-lg hover:bg-gold/80 transition-colors"
          onClick={connectWallet}
        >
          Connect WAX Wallet
        </Button>
      )}
    </div>
  );
};
