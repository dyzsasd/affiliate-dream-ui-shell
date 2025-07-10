import { useState, useEffect } from 'react';

const DEBUG_MODE_KEY = 'debug_mode_enabled';
const BACKEND_URL_KEY = 'debug_backend_url';

export const useDebugMode = () => {
  const [debugMode, setDebugMode] = useState<boolean>(() => {
    const stored = localStorage.getItem(DEBUG_MODE_KEY);
    return stored === 'true';
  });
  
  const [backendUrl, setBackendUrlState] = useState<string>(() => {
    return localStorage.getItem(BACKEND_URL_KEY) || '';
  });

  const enableDebugMode = () => {
    setDebugMode(true);
    localStorage.setItem(DEBUG_MODE_KEY, 'true');
  };

  const disableDebugMode = () => {
    setDebugMode(false);
    localStorage.removeItem(DEBUG_MODE_KEY);
    resetBackendUrl();
  };

  const setBackendUrl = (url: string) => {
    setBackendUrlState(url);
    if (url.trim()) {
      localStorage.setItem(BACKEND_URL_KEY, url.trim());
    } else {
      localStorage.removeItem(BACKEND_URL_KEY);
    }
  };

  const resetBackendUrl = () => {
    setBackendUrlState('');
    localStorage.removeItem(BACKEND_URL_KEY);
  };

  // Auto-disable debug mode if no backend URL override is set for more than 24 hours
  useEffect(() => {
    if (debugMode && !backendUrl) {
      const timer = setTimeout(() => {
        disableDebugMode();
      }, 24 * 60 * 60 * 1000); // 24 hours
      
      return () => clearTimeout(timer);
    }
  }, [debugMode, backendUrl]);

  return {
    debugMode,
    enableDebugMode,
    disableDebugMode,
    backendUrl,
    setBackendUrl,
    resetBackendUrl,
  };
};