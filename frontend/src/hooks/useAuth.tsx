import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { apiClient, LoginResponse, showSuccess, showError } from '../lib/api';

interface User {
  id: string;
  name: string | null;
  email: string;
  roles: string[];
}

interface AuthContextType {
  // Estado
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Acciones
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  
  // Helpers
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const isAuthenticated = !!user;

  // Configurar token en el cliente API cuando cambie
  useEffect(() => {
    apiClient.setAccessToken(accessToken);
  }, [accessToken]);

  // Intentar refrescar la sesión al cargar la página
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Verificar estado de autenticación
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      
      // Intentar refrescar el token
      const refreshResponse = await apiClient.refreshToken();
      setAccessToken(refreshResponse.accessToken);
      
      // Obtener información del usuario
      const profileResponse = await apiClient.getProfile();
      setUser(profileResponse.user);
      
    } catch (error) {
      // Si falla el refresh, el usuario no está autenticado
      setUser(null);
      setAccessToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (credentials: { username: string; password: string }) => {
    try {
      setIsLoading(true);
      
      const response: LoginResponse = await apiClient.login(credentials);
      
      setAccessToken(response.accessToken);
      setUser(response.user);
      
      showSuccess(response.message);
      
    } catch (error) {
      throw error; // Re-lanzar para que el componente pueda manejarlo
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      
      await apiClient.logout();
      
      setUser(null);
      setAccessToken(null);
      
      showSuccess('Sesión cerrada exitosamente');
      
    } catch (error) {
      // Incluso si falla el logout en el servidor, limpiamos el estado local
      setUser(null);
      setAccessToken(null);
      showError('Error cerrando sesión, pero se limpió la sesión local');
    } finally {
      setIsLoading(false);
    }
  };

  // Refrescar autenticación
  const refreshAuth = async () => {
    await checkAuthStatus();
  };

  // Helper para verificar roles
  const hasRole = (role: string): boolean => {
    return user?.roles?.includes(role) || false;
  };

  // Helper para verificar si tiene alguno de los roles
  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => user?.roles?.includes(role)) || false;
  };

  // Configurar interceptor para refresh automático
  useEffect(() => {
    const originalRequest = apiClient.request;
    
    apiClient.request = async function<T>(url: string, options: RequestInit = {}): Promise<T> {
      try {
        return await originalRequest.call(this, url, options) as T;
      } catch (error: any) {
        // Si es error 401 y no es una petición de auth, intentar refrescar
        if (error.message.includes('401') && !url.includes('/auth/')) {
          try {
            const refreshResponse = await apiClient.refreshToken();
            setAccessToken(refreshResponse.accessToken);
            
            // Reintentar la petición original
            return await originalRequest.call(this, url, options) as T;
          } catch (refreshError) {
            // Si falla el refresh, limpiar sesión
            setUser(null);
            setAccessToken(null);
            throw refreshError;
          }
        }
        throw error;
      }
    };
    
    return () => {
      apiClient.request = originalRequest;
    };
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshAuth,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto de autenticación
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}