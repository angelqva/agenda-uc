// import { toast } from 'sonner';

// TODO: Instalar sonner: npm install sonner
const toast = {
  success: (message: string) => console.log('✅', message),
  error: (message: string) => console.error('❌', message),
};

// Configuración base de la API
const API_BASE_URL = '/api';

// Tipos para respuestas de la API
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    roles: string[];
  };
  accessToken: string;
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  accessToken: string;
}

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  roles: string[];
}

// Configuración de fetch con manejo de errores
class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    // Agregar token de acceso si está disponible
    if (this.accessToken) {
      headers.Authorization = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: 'include', // Importante para las cookies
    });

    return response;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Respuesta no válida del servidor');
    }

    const data = await response.json();

    if (!response.ok) {
      // Mostrar error con toast
      const errorMessage = data.message || `Error ${response.status}: ${response.statusText}`;
      toast.error(errorMessage);
      
      throw new Error(errorMessage);
    }

    return data;
  }

  // Método público para hacer peticiones
  async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await this.fetchWithAuth(url, options);
      return await this.handleResponse<T>(response);
    } catch (error) {
      console.error('Error en petición API:', error);
      throw error;
    }
  }

  // Métodos específicos para auth
  async login(credentials: { username: string; password: string }): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/logout', {
      method: 'POST',
    });
  }

  async refreshToken(): Promise<RefreshResponse> {
    return this.request<RefreshResponse>('/auth/refresh', {
      method: 'POST',
    });
  }

  async getProfile(): Promise<{ success: boolean; message: string; user: UserProfile }> {
    return this.request('/auth/profile');
  }

  async checkAuth(): Promise<{ success: boolean; message: string; user: UserProfile }> {
    return this.request('/auth/me');
  }
}

// Instancia singleton del cliente API
export const apiClient = new ApiClient();

// Helper para mostrar mensajes de éxito
export const showSuccess = (message: string) => {
  toast.success(message);
};

// Helper para mostrar mensajes de error
export const showError = (message: string) => {
  toast.error(message);
};