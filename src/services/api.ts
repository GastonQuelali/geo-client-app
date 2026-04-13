import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG, ENDPOINTS } from '../constants/config';
import { InitResponse, HtmlResponse, MapItem } from '../types';
import { getLocalIpAddress } from '../hooks/useAppInit';

class ApiService {
  private baseUrl: string = 'http://localhost:8000';

  private async updateBaseUrl() {
    const localIp = await getLocalIpAddress();
    this.baseUrl = `http://${localIp}:8000`;
  }

  async initApp(): Promise<InitResponse> {
    await this.updateBaseUrl();
    
    try {
      const response = await axios.post<InitResponse>(`${this.baseUrl}${ENDPOINTS.MAP_INIT}`, {
        app_id: API_CONFIG.APP_ID,
      });
      return response.data as InitResponse;
    } catch (err: any) {
      if (err.response) {
        throw new Error(`Error del servidor: ${err.response.status}`);
      }
      throw new Error('Backend no disponible. Asegúrate de que el servidor esté corriendo en la misma red.');
    }
  }

  async getMapHtml(slug: string): Promise<HtmlResponse> {
    try {
      await this.updateBaseUrl();
      const token = await SecureStore.getItemAsync('app_session_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await axios.get<HtmlResponse>(`${this.baseUrl}${ENDPOINTS.MAP_HTML(slug)}`, { headers });
      return response.data as HtmlResponse;
    } catch (err: any) {
      if (err.response) {
        throw new Error(`Error: ${err.response.status}`);
      }
      throw new Error('Backend no disponible');
    }
  }

  async getSessionToken(): Promise<string | null> {
    return SecureStore.getItemAsync('app_session_token');
  }

  async getMaps(): Promise<MapItem[]> {
    const maps = await SecureStore.getItemAsync('maps');
    return maps ? JSON.parse(maps) : [];
  }

  async saveMaps(maps: MapItem[]): Promise<void> {
    await SecureStore.setItemAsync('maps', JSON.stringify(maps));
  }
}

export const apiService = new ApiService();