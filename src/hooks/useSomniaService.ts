import { useMemo } from 'react';
import { SomniaService } from '../../services/somniaService';

export function useSomniaService(): SomniaService {
  const service = useMemo(() => {
    return new SomniaService();
  }, []);

  return service;
}
