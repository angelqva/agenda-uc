import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: string[]; // Roles requeridos para acceder
  redirectTo?: string; // Ruta de redirección si no está autenticado
}

export function ProtectedRoute({ 
  children, 
  roles = [], 
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, hasAnyRole, user } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Si se requieren roles específicos, verificar que el usuario los tenga
  if (roles.length > 0 && !hasAnyRole(roles)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Acceso Denegado
          </h1>
          <p className="text-gray-600 mb-4">
            No tienes los permisos necesarios para acceder a esta página.
          </p>
          <p className="text-sm text-gray-500">
            Roles requeridos: {roles.join(', ')}
          </p>
          <p className="text-sm text-gray-500">
            Tus roles: {user?.roles.join(', ') || 'Ninguno'}
          </p>
          <button 
            onClick={() => window.history.back()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Volver atrás
          </button>
        </div>
      </div>
    );
  }

  // Si todo está bien, renderizar el contenido
  return <>{children}</>;
}