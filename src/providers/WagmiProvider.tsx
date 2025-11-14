import React from 'react';
import { WagmiProvider as WagmiProviderBase, createConfig, http } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';
import { getConfig } from '../config/env';
import '@rainbow-me/rainbowkit/styles.css';

const config = getConfig();

// Define Somnia testnet chain
const somniaTestnet = defineChain({
  id: config.somnia.chainId,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: [config.somnia.rpcUrl],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://explorer.somnia.network',
    },
  },
  testnet: true,
});

// Create wagmi config with RainbowKit
const wagmiConfig = getDefaultConfig({
  appName: 'Somnia On-Chain Chat',
  projectId: config.rainbowKit.projectId,
  chains: [somniaTestnet],
  transports: {
    [somniaTestnet.id]: http(config.somnia.rpcUrl),
  },
  ssr: false,
});

// Create a QueryClient for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface WagmiProviderProps {
  children: React.ReactNode;
}

export function WagmiProvider({ children }: WagmiProviderProps) {
  return (
    <WagmiProviderBase config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProviderBase>
  );
}

export { wagmiConfig, somniaTestnet };
