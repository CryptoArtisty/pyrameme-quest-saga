import { useState, useEffect, useCallback } from 'react';
import { UALProvider } from 'ual-reactjs-renderer';
import { Wax } from '@eosdacio/ual-wax';
import { Anchor } from 'ual-anchor';
import { useGame } from './useGame';

// WAX Testnet Configuration
const WAX_CONFIG = {
  chainId: 'f16b1833c747c43682f4386fca9cbb327929334a762755ebec17f6f23c9b8a12',
  rpcEndpoint: 'https://testnet.waxsweden.org',
  appName: 'Pyrameme Quest Saga'
};

export const useWallet = () => {
  const { dispatch } = useGame();
  const [accountName, setAccountName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize WAX connection
  useEffect(() => {
    const wax = new Wax([{
      chainId: WAX_CONFIG.chainId,
      rpcEndpoints: [{ 
        protocol: 'https', 
        host: WAX_CONFIG.rpcEndpoint.replace('https://', ''), 
        port: 443 
      }]
    }], { appName: WAX_CONFIG.appName });

    const anchor = new Anchor([{
      chainId: WAX_CONFIG.chainId,
      rpcEndpoints: [{ 
        protocol: 'https', 
        host: WAX_CONFIG.rpcEndpoint.replace('https://', ''), 
        port: 443 
      }]
    }], { appName: WAX_CONFIG.appName });

    const provider = new UALProvider({
      chains: [{
        chainId: WAX_CONFIG.chainId,
        rpcEndpoints: [{ 
          protocol: 'https', 
          host: WAX_CONFIG.rpcEndpoint.replace('https://', ''), 
          port: 443 
        }]
      }],
      authenticators: [wax, anchor],
      appName: WAX_CONFIG.appName
    });

    window.waxProvider = provider;
  }, []);

  const connect = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const users = await window.waxProvider?.login();
      if (users?.[0]) {
        setAccountName(users[0].accountName);
        dispatch({ type: 'SET_WALLET', payload: users[0].accountName });
      }
    } catch (err) {
      setError('Failed to connect. Install WAX Cloud Wallet or Anchor.');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  const disconnect = useCallback(async () => {
    await window.waxProvider?.logout();
    setAccountName(null);
    dispatch({ type: 'SET_WALLET', payload: null });
  }, [dispatch]);

  return { accountName, isLoading, error, connect, disconnect };
};
