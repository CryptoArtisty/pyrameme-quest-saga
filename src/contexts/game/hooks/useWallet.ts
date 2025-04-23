
import { useCallback } from 'react';
import { GameStateType } from '../types';
import { convertGoldToPgl, GOLD_TO_PGL_RATE } from '@/lib/goldEconomy';

interface UseWalletProps {
  isWalletConnected: boolean;
  setIsWalletConnected: (connected: boolean) => void;
  setGameState: (state: React.SetStateAction<GameStateType>) => void;
  toast: any;
}

export const useWallet = ({
  isWalletConnected,
  setIsWalletConnected,
  setGameState,
  toast
}: UseWalletProps) => {
  const connectWallet = useCallback(async (): Promise<boolean> => {
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
  }, [setIsWalletConnected, setGameState, toast]);

  const buyPgl = useCallback(async (amount: number, currency: 'pgl' | 'wax' = 'pgl'): Promise<boolean> => {
    try {
      if (!isWalletConnected) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your WAX wallet first.",
        });
        return false;
      }
      
      const goldAmount = currency === 'pgl' ? amount * 1000 : amount * 5000;
      
      toast({
        title: "Processing Transaction...",
        description: `Sending ${amount} ${currency.toUpperCase()} to buy ${goldAmount} gold`,
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance + goldAmount
      }));
      
      toast({
        title: "Transaction Complete",
        description: `Successfully purchased ${goldAmount} gold!`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Transaction Failed",
        description: "Could not complete the gold purchase.",
      });
      return false;
    }
  }, [isWalletConnected, setGameState, toast]);

  const convertGoldToPGL = useCallback(async (goldAmount: number): Promise<boolean> => {
    try {
      if (!isWalletConnected) {
        toast({
          title: "Wallet Not Connected",
          description: "Please connect your WAX wallet first.",
        });
        return false;
      }
      
      if (gameState.walletBalance < goldAmount) {
        toast({
          title: "Insufficient Funds",
          description: `You need ${goldAmount} gold to convert to PGL.`,
        });
        return false;
      }
      
      const pglAmount = convertGoldToPgl(goldAmount);
      
      toast({
        title: "Processing Conversion...",
        description: `Converting ${goldAmount} gold to ${pglAmount} PGL`,
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setGameState(prev => ({
        ...prev,
        walletBalance: prev.walletBalance - goldAmount
      }));
      
      toast({
        title: "Conversion Complete",
        description: `Successfully converted ${goldAmount} gold to ${pglAmount} PGL! The PGL has been sent to your wallet.`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Conversion Failed",
        description: "Could not complete the gold to PGL conversion.",
      });
      return false;
    }
  }, [isWalletConnected, gameState.walletBalance, setGameState, toast]);

  return { connectWallet, buyPgl, convertGoldToPGL };
};
