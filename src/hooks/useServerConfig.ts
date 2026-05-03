import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const DEFAULT_IP = '192.168.105.219';
const DEFAULT_PROTOCOL = 'http';
const DEFAULT_PORT = '6080';

export interface ServerConfig {
  dynamicPageEnabled: boolean;
  serverIP: string;
  protocol: string;
  port: string;
  isLoading: boolean;
  toggleDynamicPage: () => Promise<void>;
  saveServerIP: (ip: string) => Promise<void>;
  saveProtocol: (protocol: string) => Promise<void>;
  savePort: (port: string) => Promise<void>;
  reloadSettings: () => Promise<void>;
}

export const useServerConfig = (): ServerConfig => {
  const [dynamicPageEnabled, setDynamicPageEnabled] = useState(false);
  const [serverIP, setServerIP] = useState(DEFAULT_IP);
  const [protocol, setProtocol] = useState(DEFAULT_PROTOCOL);
  const [port, setPort] = useState(DEFAULT_PORT);
  const [isLoading, setIsLoading] = useState(true);

  const reloadSettings = async () => {
    try {
      setIsLoading(true);
      const enabled = await SecureStore.getItemAsync('dynamic_page_enabled');
      const savedIP = await SecureStore.getItemAsync('server_ip');
      const savedProtocol = await SecureStore.getItemAsync('server_protocol');
      const savedPort = await SecureStore.getItemAsync('server_port');
      
      setDynamicPageEnabled(enabled === 'true');
      setServerIP(savedIP || DEFAULT_IP);
      setProtocol(savedProtocol || DEFAULT_PROTOCOL);
      setPort(savedPort !== null ? savedPort : DEFAULT_PORT);
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

  const saveProtocol = async (newProtocol: string) => {
    try {
      await SecureStore.setItemAsync('server_protocol', newProtocol);
      setProtocol(newProtocol);
    } catch (error) {
      console.error('Error saving protocol:', error);
    }
  };

  const savePort = async (newPort: string) => {
    try {
      await SecureStore.setItemAsync('server_port', newPort);
      setPort(newPort);
    } catch (error) {
      console.error('Error saving port:', error);
    }
  };

  useEffect(() => {
    reloadSettings();
  }, []);

  return {
    dynamicPageEnabled,
    serverIP,
    protocol,
    port,
    isLoading,
    toggleDynamicPage,
    saveServerIP,
    saveProtocol,
    savePort,
    reloadSettings,
  };
};
