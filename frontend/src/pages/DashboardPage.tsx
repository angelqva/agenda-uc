import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { apiClient, showSuccess, showError } from '../lib/api';

// Tipos de ejemplo para datos del dashboard
interface Activity {
  id: string;
  title: string;
  description: string;
  createdAt: string;
}

// Funciones para las queries
const fetchActivities = async (): Promise<Activity[]> => {
  return apiClient.request<Activity[]>('/activities');
};

const createActivity = async (data: { title: string; description: string }): Promise<Activity> => {
  return apiClient.request<Activity>('/activities', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export function DashboardPage() {
  const { user, logout, hasRole } = useAuth();
  const queryClient = useQueryClient();

  // Query para obtener actividades
  const {
    data: activities = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutation para crear actividad
  const createActivityMutation = useMutation({
    mutationFn: createActivity,
    onSuccess: (newActivity) => {
      // Actualizar la caché optimistamente
      queryClient.setQueryData(['activities'], (old: Activity[] = []) => [
        newActivity,
        ...old
      ]);
      showSuccess('Actividad creada exitosamente');
    },
    onError: (error: any) => {
      showError(error.message || 'Error creando actividad');
    },
  });

  const handleCreateActivity = () => {
    createActivityMutation.mutate({
      title: 'Nueva Actividad',
      description: 'Descripción de ejemplo'
    });
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      // El error ya se maneja en el hook useAuth
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-4">No se pudieron cargar las actividades</p>
          <button 
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">
                Bienvenido, {user?.name || user?.email}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Roles: {user?.roles.join(', ')}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Sección de acciones (solo para administradores) */}
          {hasRole('ADMINISTRADOR') && (
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Acciones de Administrador
              </h2>
              <button
                onClick={handleCreateActivity}
                disabled={createActivityMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                {createActivityMutation.isPending ? 'Creando...' : 'Crear Actividad'}
              </button>
            </div>
          )}

          {/* Lista de actividades */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">
                Actividades Recientes
              </h2>
            </div>
            
            <div className="p-6">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No hay actividades disponibles
                </p>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4">
                      <h3 className="font-medium text-gray-900">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Creado: {new Date(activity.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}