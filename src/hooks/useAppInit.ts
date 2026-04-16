import { useState, useEffect } from 'react';
import { apiService } from '../services/api';

interface UseAppInitResult {
  isLoading: boolean;
  error: string | null;
  htmlContent: string | null;
  retry: () => void;
}

export const useAppInit = (slug: string): UseAppInitResult => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  const loadMap = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiService.getPublicMap(slug);
      setHtmlContent(response.html_contenido);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Map load error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMap();
  }, [slug]);

  return {
    isLoading,
    error,
    htmlContent,
    retry: loadMap,
  };
};