import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const DEFAULT_IP = '200.58.81.12';

export interface ServerConfig {
  dynamicPageEnabled: boolean;
  serverIP: string;
  isLoading: boolean;
  toggleDynamicPage: () => Promise<void>;
  saveServerIP: (ip: string) => Promise<void>;
  reloadSettings: () => Promise<void>;
}

export const useServerConfig = (): ServerConfig => {
  const [dynamicPageEnabled, setDynamicPageEnabled] = useState(false);
  const [serverIP, setServerIP] = useState(DEFAULT_IP);
  const [isLoading, setIsLoading] = useState(true);

  const reloadSettings = async () => {
    try {
      setIsLoading(true);
      const enabled = await SecureStore.getItemAsync('dynamic_page_enabled');
      const savedIP = await SecureStore.getItemAsync('server_ip');
      
      setDynamicPageEnabled(enabled === 'true');
      setServerIP(savedIP || DEFAULT_IP);
    } catch (error) {
      console.error('Error loading server config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDynamicPage = async () => {
    try {
      const newValue = !dynamicPageEnabled;
      await SecureStore.setItemAsync('dynamic_page_enabled', String(newValue));
      setDynamicPageEnabled(newValue);
    } catch (error) {
      console.error('Error saving dynamic page setting:', error);
    }
  };

  const saveServerIP = async (ip: string) => {
    try {
      await SecureStore.setItemAsync('server_ip', ip);
      setServerIP(ip);
    } catch (error) {
      console.error('Error saving server IP:', error);
    }
  };

  useEffect(() => {
    reloadSettings();
  }, []);

  return {
    dynamicPageEnabled,
    serverIP,
    isLoading,
    toggleDynamicPage,
    saveServerIP,
    reloadSettings,
  };
};
