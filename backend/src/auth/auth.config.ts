export const AUTH_CONFIG = {
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key-change-in-production',
  JWT_EXPIRE_TIME: '15m', // Access token expira en 15 minutos
  JWT_REFRESH_EXPIRE_TIME: '7d', // Refresh token expira en 7 días
  
  // Cookie Configuration
  COOKIE_NAME: 'auth_token',
  REFRESH_COOKIE_NAME: 'refreshToken',
  COOKIE_CONFIG: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'strict' as const,
    maxAge: 15 * 60 * 1000, // 15 minutos en milisegundos
    path: '/',
  },
  REFRESH_COOKIE_CONFIG: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en milisegundos
    path: '/api/auth',
  },
  
  // LDAP Configuration
  LDAP_CONFIG: {
    url: process.env.LDAP_URL || 'ldap://localhost:389',
    bindDN: process.env.LDAP_BIND_DN || 'ldap.search@reduc.edu.cu',
    bindPassword: process.env.LDAP_BIND_CREDENTIALS || '1234asdf*',
    baseDN: process.env.LDAP_SEARCH_BASE || 'DC=REDUC,DC=EDU,DC=CU',
    searchFilter: process.env.LDAP_SEARCH_FILTER || '(sAMAccountName={{username}})', // {{username}} será reemplazado
  },
} as const;

// Enum para tipos de trazas de autenticación
export enum AuthTraceType {
  LOGIN_LDAP = 'LOGIN_LDAP',
  LOGOUT_LDAP = 'LOGOUT_LDAP',
  LOGIN_FAILED_LDAP = 'LOGIN_FAILED_LDAP',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}