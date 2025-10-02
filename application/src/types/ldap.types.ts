import { ServiceResponse } from './common.types';

/**
 * Tipos para servicios LDAP
 * Siguiendo Clean Architecture y tipado estricto con TypeScript
 */

/**
 * Configuración base para conexión LDAP
 */
export interface LdapConfig {
  /** URL del servidor LDAP */
  url: string;
  /** DN base para búsquedas */
  baseDN: string;
  /** DN para bind administrativo */
  bindDN: string;
  /** Contraseña para bind administrativo */
  bindPassword: string;
  /** Filtro para búsqueda de usuarios */
  userSearchFilter: string;
  /** Atributos a obtener del usuario */
  userAttributes: string[];
  /** Timeout de conexión en ms */
  timeout?: number;
}

/**
 * Credenciales para autenticación LDAP
 */
export interface LdapCredentials {
  /** Nombre de usuario */
  username: string;
  /** Contraseña del usuario */
  password: string;
}

/**
 * Usuario raw obtenido directamente de LDAP
 */
export interface LdapUserRaw {
  /** DN del usuario */
  dn: string;
  /** Atributos del usuario como vienen de LDAP */
  attributes: Record<string, string | string[]>;
}

/**
 * Usuario mapeado según requerimientos del negocio
 * - nombre mapeado como displayName del LDAP
 * - correo mapeado como mail del usuario
 */
export interface LdapUser {
  /** Nombre completo del usuario (displayName) */
  nombre: string;
  /** Correo electrónico del usuario */
  correo: string;
  /** Información adicional del LDAP */
  metadata?: {
    /** DN completo del usuario */
    dn: string;
    /** Nombre de usuario para login */
    username: string;
    /** Departamento u organización */
    departamento?: string;
    /** Cargo del usuario */
    cargo?: string;
    /** Teléfono si está disponible */
    telefono?: string;
  };
}

/**
 * Opciones para la búsqueda de usuarios en LDAP
 */
export interface LdapSearchOptions {
  /** Término de búsqueda */
  searchTerm?: string;
  /** Límite de resultados */
  limit?: number;
}

/**
 * @deprecated Utilizar LdapAuthResponse en su lugar.
 */
export type LdapAuthResult = ServiceResponse<LdapUser>;

/**
 * @deprecated Utilizar LdapSearchResponse en su lugar.
 */
export type LdapSearchResult = ServiceResponse<{ users: LdapUser[]; total: number }>;

/**
 * Tipos de respuesta estandarizados para el servicio LDAP
 */
export type LdapAuthResponse = ServiceResponse<LdapUser>;
export type LdapSearchResponse = ServiceResponse<{ users: LdapUser[]; total: number }>;
export type LdapFindUserResponse = ServiceResponse<LdapUser>;

/**
 * @deprecated Utilizar la estructura ServiceResponse.errors
 */
export enum LdapErrorType {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  SEARCH_FAILED = 'SEARCH_FAILED',
  BIND_FAILED = 'BIND_FAILED',
  TIMEOUT = 'TIMEOUT',
  INVALID_CONFIG = 'INVALID_CONFIG'
}

/**
 * Error personalizado para operaciones LDAP
 */
export class LdapError extends Error {
  constructor(
    public type: LdapErrorType,
    message: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'LdapError';
  }
}