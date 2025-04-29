import { useCallback } from 'react';
import { GameStateType } from '../types';
import AnchorLink from 'anchor-link';
import BrowserTransport from 'anchor-link-browser-transport';
import { convertGoldToPgl } from '@/lib/goldEconomy';

interface UseWalletProps {
  isWalletConnected: boolean;
  gameState: GameStateType;
  setIsWalletConnected: (connected: boolean) => void;
  setGameState: (updater: React.SetStateAction<GameStateType>) => void;
  toast: (opts: { title: string; description: string }) => void;
}

// Anchor Link config for WAX Testnet
const transport = new BrowserTransport();
const link = new AnchorLink({
  transport,
  chains: [
    {
      chainId:
        'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
      nodeUrl: 'https://testnet.waxsweden.org',
    },
  ],
});

export const useWallet = ({
  isWalletConnected,
  gameState,
  setIsWalletConnected,
  setGameState,
  toast,
}: UseWalletProps) => {
  const connectWallet = useCallback(async (): Promise<boolean> => {
    try {
      toast({
        title: '🔗 Connecting Wallet…',
        description: 'Approve in your Anchor wallet.',
      });
      const identity = await link.login('pyrameme-quest-saga');
      const { actor } = identity.session.auth;

      setIsWalletConnected(true);
      setGameState(prev => ({
        ...prev,
        playerWaxWallet: actor,
        playerAccount: actor,
      }));
      toast({
        title: '✅ Wallet Connected',
        description: `Logged in as ${actor}`,
      });
      return true;
    } catch (err) {
      console.error('Anchor login failed', err);
      toast({
        title: '❌ Connection Failed',
        description: 'Could not connect via Anchor.',
      });
      return false;
    }
  }, [setIsWalletConnected, setGameState, toast]);

  const buyPgl = useCallback(
    async (amount: number, currency: 'pgl' | 'wax' = 'pgl'): Promise<boolean> => {
      if (!isWalletConnected) {
        toast({
          title: '⚠️ Wallet Not Connected',
          description: 'Please connect your WAX wallet first.',
        });
        return false;
      }
      const goldAmount = currency === 'pgl' ? amount * 1000 : amount * 5000;
      toast({
        title: 'Processing Transaction...',
        description: `Sending ${amount.toFixed(
          4
        )} ${currency.toUpperCase()} to buy ${goldAmount} gold`,
      });
      // TODO: replace with real on-chain action via link.transact()
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance + goldAmount,
      }));
      toast({
        title: 'Transaction Complete',
        description: `Successfully purchased ${goldAmount} gold!`,
      });
      return true;
    },
    [isWalletConnected, setGameState, toast]
  );

  const convertGoldToPGL = useCallback(
    async (goldAmount: number): Promise<boolean> => {
      if (!isWalletConnected) {
        toast({
          title: '⚠️ Wallet Not Connected',
          description: 'Please connect your WAX wallet first.',
        });
        return false;
      }
      if (gameState.walletBalance < goldAmount) {
        toast({
          title: '❌ Insufficient Funds',
          description: `You need ${goldAmount} gold to convert.`,
        });
        return false;
      }
      const pglAmount = convertGoldToPgl(goldAmount);
      toast({
        title: 'Processing Conversion...',
        description: `Converting ${goldAmount} gold to ${pglAmount} PGL`,
      });
      // TODO: replace with real on-chain conversion via link.transact()
      await new Promise(resolve => setTimeout(resolve, 2000));
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - goldAmount,
      }));
      toast({
        title: 'Conversion Complete',
        description: `Converted ${goldAmount} gold to ${pglAmount} PGL!`,
      });
      return true;
    },
    [isWalletConnected, gameState.walletBalance, setGameState, toast]
  );

  return { connectWallet, buyPgl, convertGoldToPGL };
};
