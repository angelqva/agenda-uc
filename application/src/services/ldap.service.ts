import { Client, type Entry } from 'ldapts';
import type {
  LdapAuthResponse,
  LdapConfig,
  LdapCredentials,
  LdapFindUserResponse,
  LdapSearchOptions,
  LdapSearchResponse,
  LdapUser
} from '../types/ldap.types';

/**
 * Interface para el servicio LDAP
 * Define el contrato que debe cumplir cualquier implementación
 */
export interface ILdapService {
  /**
   * Autentica un usuario contra LDAP
   * @param credentials - Credenciales del usuario
   * @returns Resultado de la autenticación con usuario mapeado
   */
  authenticate(credentials: LdapCredentials): Promise<LdapAuthResponse>;

  /**
   * Busca usuarios en LDAP
   * @param options - Opciones de búsqueda
   * @returns Lista de usuarios encontrados mapeados
   */
  searchUsers(options?: LdapSearchOptions): Promise<LdapSearchResponse>;

  /**
   * Busca un usuario específico por username
   * @param username - Nombre de usuario a buscar
   * @returns Resultado con usuario encontrado o null
   */
  findUserByUsername(username: string): Promise<LdapFindUserResponse>;
}

/**
 * Implementación del servicio LDAP
 * Utiliza ldapts para la conexión y manejo de LDAP
 */
export class LdapService implements ILdapService {
  private readonly client: Client;
  private readonly config: LdapConfig;

  constructor(config: LdapConfig) {
    this.config = config;
    this.client = new Client({
      url: this.config.url
    });
  }

  async authenticate(credentials: LdapCredentials): Promise<LdapAuthResponse> {
    try {
      // 1. Conectar y autenticar con las credenciales de administrador
      await this.client.bind(this.config.bindDN, this.config.bindPassword);

      // 2. Buscar al usuario por su username

      const searchOptions = {
        filter: `(sAMAccountName=${credentials.username})`,
        scope: 'sub',
        attributes: this.config.userAttributes
      } as const;

      const { searchEntries } = await this.client.search(this.config.baseDN, searchOptions);

      if (searchEntries.length === 0) {

        return {
          success: false,
          data: null,
          errors: { root: 'Verifique los campos', fields: { username: ['Usuario no encontrado'] } },
          toast: {
            title: 'Error de Autenticación',
            description: 'El usuario proporcionado no existe.',
            type: 'error'
          }
        };
      }

      const userEntry = searchEntries[0];
      const userDN = userEntry.dn;

      // 3. Intentar autenticar con las credenciales del usuario
      // Es necesario crear un nuevo cliente para esta autenticación específica
      const userClient = new Client({ url: this.config.url });
      try {
        await userClient.bind(userDN, credentials.password);

        const ldapUser = this.mapLdapUser(userEntry);
        return {
          success: true,
          data: ldapUser,
          errors: null,
          toast: {
            title: 'Inicio de Sesión Exitoso',
            description: `Bienvenido, ${ldapUser.nombre}`,
            type: 'success'
          }
        };
      } catch (authError) {
        // authentication failed for user bind
        return {
          success: false,
          data: null,
          errors: { root: 'Verifique los campos', fields: { password: ['La contraseña es incorrecta.'] } },
          toast: {
            title: 'Error de Autenticación',
            description: 'La contraseña es incorrecta.',
            type: 'error'
          }
        };
      } finally {
        await userClient.unbind();
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      return {
        success: false,
        data: null,
        errors: { root: `Error de conexión LDAP: ${errorMessage}` },
        toast: {
          title: 'Error del Servicio LDAP',
          description: 'No se pudo establecer la conexión con el servidor.',
          type: 'error'
        }
      };
    } finally {
      await this.client.unbind();
    }
  }

  async searchUsers(options?: LdapSearchOptions): Promise<LdapSearchResponse> {
    const searchTerm = options?.searchTerm ?? '*';
    const limit = options?.limit ?? 50;

    try {
      await this.client.bind(this.config.bindDN, this.config.bindPassword);

      const searchFilter = `(&(${this.config.userSearchFilter})(|(cn=*${searchTerm}*)(displayName=*${searchTerm}*)(sAMAccountName=*${searchTerm}*)))`;
      const searchOptions = {
        filter: searchFilter,
        scope: 'sub',
        sizeLimit: limit,
        attributes: this.config.userAttributes
      } as const;

      const { searchEntries } = await this.client.search(this.config.baseDN, searchOptions);

      const users = searchEntries.map(entry => this.mapLdapUser(entry));

      return {
        success: true,
        data: { users, total: users.length },
        errors: null,
        toast: null
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      return {
        success: false,
        data: null,
        errors: { root: `Error de búsqueda LDAP: ${errorMessage}` },
        toast: {
          title: 'Error de Búsqueda',
          description: 'No se pudo realizar la búsqueda en el servidor LDAP.',
          type: 'error'
        }
      };
    } finally {
      await this.client.unbind();
    }
  }

  async findUserByUsername(username: string): Promise<LdapFindUserResponse> {
    try {
      await this.client.bind(this.config.bindDN, this.config.bindPassword);

      const searchOptions = {
        filter: `(sAMAccountName=${username})`,
        scope: 'sub',
        attributes: this.config.userAttributes
      } as const;

      const { searchEntries } = await this.client.search(this.config.baseDN, searchOptions);

      if (searchEntries.length === 0) {
        return {
          success: true,
          data: null,
          errors: null,
          toast: null
        };
      }

      const user = this.mapLdapUser(searchEntries[0]);
      return {
        success: true,
        data: user,
        errors: null,
        toast: null
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      return {
        success: false,
        data: null,
        errors: { root: `Error de conexión LDAP: ${errorMessage}` },
        toast: {
          title: 'Error de Búsqueda',
          description: `No se pudo encontrar al usuario ${username}.`,
          type: 'error'
        }
      };
    } finally {
      await this.client.unbind();
    }
  }

  private mapLdapUser(entry: Entry): LdapUser {
    // Los atributos están directamente en el objeto entry, no en entry.attributes
    const attributes = entry as unknown as { [key: string]: string | string[] | Buffer | Buffer[] };

    const getAttribute = (name: string): string | undefined => {
      const value = attributes[name];
      if (Array.isArray(value)) {
        const firstValue = value[0];
        if (firstValue) {
          return Buffer.isBuffer(firstValue) ? firstValue.toString('utf-8') : firstValue.toString();
        }
        return undefined;
      }
      if (value) {
        return Buffer.isBuffer(value) ? value.toString('utf-8') : value.toString();
      }
      return undefined;
    };

    return {
      nombre: getAttribute('displayName') ?? getAttribute('cn') ?? '',
      correo: getAttribute('mail') ?? '',
      metadata: {
        dn: entry.dn.toString(),
        username: getAttribute('sAMAccountName') ?? '',
        departamento: getAttribute('department'),
        cargo: getAttribute('title'),
        telefono: getAttribute('telephoneNumber')
      }
    };
  }
}

/**
 * Crea una instancia del servicio LDAP para propósitos de testing.
 * @param config - Configuración LDAP a utilizar en el servicio.
 * @returns Instancia del servicio LDAP.
 */
export function createLdapServiceForTesting(config: LdapConfig): ILdapService {
  return new LdapService(config);
}

/**
 * Proveedor de servicio LDAP para Inversión de Dependencias.
 *
 * Utiliza una configuración flexible para adaptarse a diferentes entornos LDAP.
 */
export const ldapServiceProvider = {
  provide: 'ILdapService',
  useFactory: () => {
    const config: LdapConfig = {
      url: process.env.LDAP_URL!,
      baseDN: process.env.LDAP_BASE_DN!,
      bindDN: process.env.LDAP_BIND_DN!,
      bindPassword: process.env.LDAP_BIND_PASSWORD!,
      userSearchFilter: process.env.LDAP_USER_SEARCH_FILTER || '(objectClass=person)',
      userAttributes: process.env.LDAP_USER_ATTRIBUTES
        ? process.env.LDAP_USER_ATTRIBUTES.split(',')
        : ['cn', 'displayName', 'mail', 'sAMAccountName', 'department', 'title', 'telephoneNumber']
    };
    return new LdapService(config);
  },
  inject: []
};
