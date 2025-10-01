import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
// import { DashboardPage } from './pages/DashboardPage';

// Componente de ejemplo para el dashboard (sin TanStack Query por ahora)
function SimpleDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎉 Dashboard Funcional
        </h1>
        <p className="text-gray-600 mb-8">
          El sistema de autenticación está funcionando correctamente
        </p>
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-4">Próximos pasos:</h2>
          <ul className="text-left space-y-2 text-sm text-gray-600">
            <li>✅ Autenticación LDAP funcionando</li>
            <li>✅ Refresh tokens seguros</li>
            <li>✅ Protección de rutas</li>
            <li>✅ Manejo de roles</li>
            <li>⏳ Instalar TanStack Query</li>
            <li>⏳ Instalar Sonner para toasts</li>
            <li>⏳ Implementar componentes de UI</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Página de ejemplo para administradores
function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          🔒 Página de Administrador
        </h1>
        <p className="text-gray-600">
          Solo usuarios con rol ADMINISTRADOR pueden ver esto
        </p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <SimpleDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta protegida por rol */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute roles={['ADMINISTRADOR']}>
                <AdminPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Redirección por defecto */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600">Página no encontrada</p>
                </div>
              </div>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;