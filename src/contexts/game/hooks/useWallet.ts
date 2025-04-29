import { useCallback } from 'react';
import { GameStateType } from '../types';
import { convertGoldToPgl } from '@/lib/goldEconomy';
import { WaxJS } from '@waxio/waxjs/dist';

interface UseWalletProps {
  isWalletConnected: boolean;
  gameState: GameStateType;
  setIsWalletConnected: (connected: boolean) => void;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  toast: (options: { title: string; description: string }) => void;
}

export const useWallet = ({
  isWalletConnected,
  gameState,
  setIsWalletConnected,
  setGameState,
  toast
}: UseWalletProps) => {
  // Initialize WaxJS for testnet
  const wax = new WaxJS({
    rpcEndpoint: 'https://testnet.waxsweden.org',
    tryAutoLogin: false,
  });

  const connectWallet = useCallback(async (): Promise<boolean> => {
    try {
      toast({
        title: 'Connecting Wallet...',
        description: 'Approve connection in your WAX extension.'
      });

      const userAccount = await wax.login();
      setIsWalletConnected(true);
      setGameState(prev => ({
        ...prev,
        playerWaxWallet: userAccount,
        playerAccount: userAccount
      }));

      toast({
        title: 'Wallet Connected',
        description: `Logged in as ${userAccount}`
      });
      return true;
    } catch (error) {
      console.error('WAX login failed', error);
      toast({
        title: 'Connection Failed',
        description: 'Could not connect to WAX wallet.'
      });
      return false;
    }
  }, [wax, setIsWalletConnected, setGameState, toast]);

  const buyPgl = useCallback(async (amount: number, currency: 'pgl' | 'wax' = 'pgl'): Promise<boolean> => {
    if (!isWalletConnected) {
      toast({ title: 'Wallet Not Connected', description: 'Please connect your WAX wallet first.' });
      return false;
    }
    try {
      const goldAmount = currency === 'pgl' ? amount * 1000 : amount * 5000;
      toast({ title: 'Processing Transaction...', description: `Sending ${amount} ${currency.toUpperCase()} to buy ${goldAmount} gold` });

      // TODO: implement real on-chain transaction using wax.api.transact
      await wax.api.transact({
        actions: [{
          account: 'eosio.token',
          name: 'transfer',
          authorization: [{ actor: wax.userAccount, permission: 'active' }],
          data: {
            from: wax.userAccount,
            to: 'pyramemesaga', // your contract account
            quantity: `${amount.toFixed(4)} ${currency.toUpperCase()}`,
            memo: 'buy gold'
          }
        }]
      }, { broadcast: true, sign: true });

      setGameState(prev => ({ ...prev, walletBalance: prev.walletBalance + goldAmount }));
      toast({ title: 'Transaction Complete', description: `Purchased ${goldAmount} gold!` });
      return true;
    } catch (error) {
      console.error('buyPgl failed', error);
      toast({ title: 'Transaction Failed', description: 'Could not complete the purchase.' });
      return false;
    }
  }, [isWalletConnected, setGameState, toast, wax]);

  const convertGoldToPGL = useCallback(async (goldAmount: number): Promise<boolean> => {
    if (!isWalletConnected) {
      toast({ title: 'Wallet Not Connected', description: 'Please connect your WAX wallet first.' });
      return false;
    }
    if (gameState.walletBalance < goldAmount) {
      toast({ title: 'Insufficient Funds', description: `Need ${goldAmount} gold.` });
      return false;
    }
    try {
      const pglAmount = convertGoldToPgl(goldAmount);
      toast({ title: 'Converting...', description: `Exchanging ${goldAmount} gold for ${pglAmount} PGL` });

      // TODO: implement on-chain conversion logic if desired
      await new Promise(resolve => setTimeout(resolve, 1000));

      setGameState(prev => ({ ...prev, walletBalance: prev.walletBalance - goldAmount }));
      toast({ title: 'Conversion Complete', description: `Converted ${goldAmount} gold to ${pglAmount} PGL!` });
      return true;
    } catch (error) {
      console.error('convertGoldToPGL failed', error);
      toast({ title: 'Conversion Failed', description: 'Could not convert gold to PGL.' });
      return false;
    }
  }, [isWalletConnected, gameState.walletBalance, setGameState, toast]);

  return { connectWallet, buyPgl, convertGoldToPGL };
};
