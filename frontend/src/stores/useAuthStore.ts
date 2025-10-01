import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string | null;
  email: string;
  roles: string[];
}

interface AuthState {
  // Estado
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Acciones
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
  
  // Helpers
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Estado inicial
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,

      // Acciones
      setUser: (user) => set((state) => ({ 
        user, 
        isAuthenticated: !!user 
      })),
      
      setAccessToken: (token) => set({ accessToken: token }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      logout: () => set({ 
        user: null, 
        accessToken: null, 
        isAuthenticated: false 
      }),

      // Helpers para roles
      hasRole: (role) => {
        const { user } = get();
        return user?.roles?.includes(role) || false;
      },

      hasAnyRole: (roles) => {
        const { user } = get();
        return roles.some(role => user?.roles?.includes(role)) || false;
      },
    }),
    {
      name: 'auth-storage',
      // Solo persistir user, no el accessToken por seguridad
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);