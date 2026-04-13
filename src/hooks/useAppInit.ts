import { useState, useEffect } from 'react';
import * as Network from 'expo-network';
import { apiService } from '../services/api';
import { MapItem } from '../types';

interface UseAppInitResult {
  isLoading: boolean;
  error: string | null;
  appSessionToken: string | null;
  maps: MapItem[];
  retry: () => void;
}

export const useAppInit = (): UseAppInitResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appSessionToken, setAppSessionToken] = useState<string | null>(null);
  const [maps, setMaps] = useState<MapItem[]>([]);

  const initApp = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.initApp();
      
      setAppSessionToken(response.app_session_token);
      setMaps(response.maps);
      await apiService.saveMaps(response.maps);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('App init error:', err);
      setMaps([{ slug: 'offline', name: 'Modo Offline' }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initApp();
  }, []);

  return {
    isLoading,
    error,
    appSessionToken,
    maps,
    retry: initApp,
  };
};

export const getLocalIpAddress = async (): Promise<string> => {
  try {
    const ipAddress = await Network.getIpAddressAsync();
    return ipAddress;
  } catch {
    return 'localhost';
  }
};