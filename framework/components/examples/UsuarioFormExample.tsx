'use client';

import { useState } from 'react';
import { useUsuarioErrors } from '@/hooks/useFormErrors';

/**
 * Componente de ejemplo que demuestra el manejo avanzado de errores por campo
 */
export function UsuarioFormExample() {
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState('ADMINISTRADOR');
  
  const {
    fieldErrors,
    isLoading,
    getFieldError,
    hasFieldError,
    clearFieldError,
    getRolesEfectivos,
    verificarRol,
  } = useUsuarioErrors();

  const handleGetRoles = async () => {
    await getRolesEfectivos(email);
  };

  const handleVerifyRole = async () => {
    await verificarRol(email, rol);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Gestión de Usuarios - Ejemplo
      </h2>

      {/* Campo Email */}
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Email del Usuario
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            // Limpiar error del campo cuando el usuario empiece a escribir
            if (hasFieldError('email')) {
              clearFieldError('email');
            }
          }}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasFieldError('email')
              ? 'border-red-500 bg-red-50 focus:ring-red-500'
              : 'border-gray-300'
          }`}
          placeholder="usuario@uc.cl"
        />
        {/* Mostrar error específico del campo */}
        {hasFieldError('email') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {getFieldError('email')}
          </p>
        )}
      </div>

      {/* Campo Rol */}
      <div className="mb-6">
        <label htmlFor="rol" className="block text-sm font-medium text-gray-700 mb-2">
          Rol a Verificar
        </label>
        <select
          id="rol"
          value={rol}
          onChange={(e) => {
            setRol(e.target.value);
            if (hasFieldError('rol')) {
              clearFieldError('rol');
            }
          }}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            hasFieldError('rol')
              ? 'border-red-500 bg-red-50 focus:ring-red-500'
              : 'border-gray-300'
          }`}
        >
          <option value="ADMINISTRADOR">Administrador</option>
          <option value="RECTOR">Rector</option>
          <option value="DIRECTIVO">Directivo</option>
          <option value="LOGISTICO">Logístico</option>
          <option value="RESPONSABLE_LOCAL">Responsable Local</option>
          <option value="RESPONSABLE_MEDIO">Responsable Medio</option>
        </select>
        {hasFieldError('rol') && (
          <p className="mt-1 text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {getFieldError('rol')}
          </p>
        )}
      </div>

      {/* Botones de Acción */}
      <div className="space-y-3">
        <button
          onClick={handleGetRoles}
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Obteniendo...
            </>
          ) : (
            'Obtener Roles Efectivos'
          )}
        </button>

        <button
          onClick={handleVerifyRole}
          disabled={isLoading}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Verificando...
            </>
          ) : (
            'Verificar Rol'
          )}
        </button>
      </div>

      {/* Mostrar errores generales */}
      {Object.keys(fieldErrors).length > 0 && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Hay errores en el formulario
              </h3>
              <p className="mt-1 text-sm text-red-700">
                Por favor, revisa los campos marcados en rojo arriba.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Nota informativa */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Ejemplo de Manejo de Errores
            </h3>
            <p className="mt-1 text-sm text-blue-700">
              Este componente demuestra cómo los errores aparecen específicamente en cada campo, 
              con mensajes contextuales y notificaciones toast automáticas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}