import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const SERVER_HOST = 'localhost';
const SERVER_PORT = '8000';

export interface PublicMapResponse {
  html_contenido: string | null;
}

interface GuestTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

class ApiService {
  private baseUrl: string = `http://${SERVER_HOST}:${SERVER_PORT}`;

  async getGuestToken(): Promise<string> {
    const storedToken = await SecureStore.getItemAsync('guest_token');
    if (storedToken) {
      return storedToken;
    }

    const response = await axios.post<GuestTokenResponse>(
      `${this.baseUrl}/api/v1/auth/guest-token`
    );
    const token = response.data.access_token;
    await SecureStore.setItemAsync('guest_token', token);
    return token;
  }

  async getPublicMap(slug: string): Promise<PublicMapResponse> {
    try {
      const token = await this.getGuestToken();
      
      const response = await axios.get<PublicMapResponse>(
        `${this.baseUrl}/api/v1/map/public-map/${slug}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status: number }; message?: string };
      if (axiosErr.response?.status === 403) {
        throw new Error('Servicio no disponible en este momento');
      }
      if (axiosErr.response?.status === 404) {
        throw new Error('Mapa no encontrado');
      }
      if (axiosErr.response?.status) {
        throw new Error(`Error del servidor: ${axiosErr.response.status}`);
      }
      throw new Error('Backend no disponible. Asegúrate de que el servidor esté corriendo en la misma red.');
    }
  }
}

export const apiService = new ApiService();