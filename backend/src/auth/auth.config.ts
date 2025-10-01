export const AUTH_CONFIG = {
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
  JWT_EXPIRE_TIME: '30m', // Token expira en 30 minutos
  
  // Cookie Configuration
  COOKIE_NAME: 'auth_token',
  COOKIE_CONFIG: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'strict' as const,
    maxAge: 30 * 60 * 1000, // 30 minutos en milisegundos
    path: '/',
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