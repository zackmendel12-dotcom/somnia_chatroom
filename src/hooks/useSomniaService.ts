import { useMemo } from 'react';
import { useWalletClient, usePublicClient } from 'wagmi';
import { SomniaService, createServiceWithWalletClient } from '../../services/somniaService';

export function useSomniaService(): SomniaService | null {
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const service = useMemo(() => {
    if (!walletClient) {
      return null;
    }

    return createServiceWithWalletClient(walletClient, publicClient);
  }, [walletClient, publicClient]);

  return service;
}
