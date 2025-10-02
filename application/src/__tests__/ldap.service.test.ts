/**
 * Pruebas unitarias para LdapService
 * Siguiendo TDD y principios de testing definidos en copilot.json
 */

import { describe, test, expect, beforeEach, vi } from 'vitest';
import { LdapService, type ILdapService } from '../services/ldap.service';
import type { LdapConfig, LdapCredentials, LdapSearchOptions } from '../types/ldap.types';

// Mock de ldapts
const mockClient = {
  bind: vi.fn(),
  search: vi.fn(),
  unbind: vi.fn(() => Promise.resolve())
};

vi.mock('ldapts', () => ({
  Client: vi.fn().mockImplementation(() => mockClient)
}));

describe('LdapService', () => {
  let service: ILdapService;
  const testConfig: LdapConfig = {
    url: 'ldap://localhost:389',
    baseDN: 'dc=test,dc=com',
    bindDN: 'cn=admin,dc=test,dc=com',
    bindPassword: 'admin123',
    userSearchFilter: '(objectClass=person)',
    userAttributes: ['cn', 'displayName', 'mail', 'sAMAccountName', 'department', 'title', 'telephoneNumber']
  };

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    service = new LdapService(testConfig);
  });

  describe('authenticate', () => {
    const credentials: LdapCredentials = {
      username: 'testuser',
      password: 'testpassword'
    };

    test('debe autenticar exitosamente un usuario válido', async () => {
      // Arrange
      const mockUserEntry = {
        dn: 'cn=testuser,dc=test,dc=com',
        attributes: {
          cn: 'testuser',
          displayName: 'Usuario de Prueba',
          mail: 'testuser@test.com',
          sAMAccountName: 'testuser',
          department: 'TI'
        }
      };

      mockClient.search.mockResolvedValue({
        searchEntries: [mockUserEntry]
      });
      mockClient.bind.mockResolvedValue(undefined);

      // Act
      const result = await service.authenticate(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.nombre).toBe('Usuario de Prueba');
      expect(result.data?.correo).toBe('testuser@test.com');
      expect(result.toast?.title).toBe('Inicio de Sesión Exitoso');
    });

    test('debe fallar cuando el usuario no existe', async () => {
      // Arrange
      mockClient.search.mockResolvedValue({
        searchEntries: []
      });

      // Act
      const result = await service.authenticate(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errors?.root).toBe('Usuario no encontrado');
      expect(result.toast?.type).toBe('error');
    });

    test('debe fallar cuando las credenciales son inválidas', async () => {
      // Arrange
      const mockUserEntry = {
        dn: 'cn=testuser,dc=test,dc=com',
        attributes: {
          cn: 'testuser',
          displayName: 'Usuario de Prueba',
          mail: 'testuser@test.com'
        }
      };

      mockClient.search.mockResolvedValueOnce({
        searchEntries: [mockUserEntry]
      });
      // El segundo bind (el de autenticación) es el que falla
      mockClient.bind.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('Invalid credentials'));

      // Act
      const result = await service.authenticate(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errors?.root).toBe('Credenciales inválidas');
      expect(result.toast?.description).toBe('La contraseña es incorrecta.');
    });

    test('debe manejar errores de conexión LDAP', async () => {
      // Arrange
      mockClient.search.mockRejectedValue(new Error('Connection failed'));

      // Act
      const result = await service.authenticate(credentials);

      // Assert
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errors?.root).toContain('Error de conexión');
      expect(result.toast?.type).toBe('error');
    });

    test('debe autenticar un usuario existente en el dominio', async () => {
      // Arrange
      const credentials = {
        username: 'angel.napoles',
        password: '1234asdf*'
      };
      const mockUserEntry = {
        dn: 'cn=angel.napoles,dc=reduc,dc=edu,dc=cu',
        attributes: {
          cn: 'angel.napoles',
          displayName: 'angel.napoles',
          mail: 'angel.napoles@reduc.edu.cu',
          sAMAccountName: 'angel.napoles'
        }
      };

      mockClient.search.mockResolvedValue({
        searchEntries: [mockUserEntry]
      });
      mockClient.bind.mockResolvedValue(undefined);

      // Act
      const result = await service.authenticate(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.nombre).toBe('angel.napoles');
      expect(result.data?.correo).toBe('angel.napoles@reduc.edu.cu');
      expect(result.toast?.type).toBe('success');
    });

    test('debe autenticar al usuario rector', async () => {
      // Arrange
      const credentials = {
        username: 'rector',
        password: '1234asdf*'
      };
      const mockUserEntry = {
        dn: 'cn=rector,dc=reduc,dc=edu,dc=cu',
        attributes: {
          cn: 'rector',
          displayName: 'Rector',
          mail: 'rector@reduc.edu.cu',
          sAMAccountName: 'rector'
        }
      };

      mockClient.search.mockResolvedValue({
        searchEntries: [mockUserEntry]
      });
      mockClient.bind.mockResolvedValue(undefined);

      // Act
      const result = await service.authenticate(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.nombre).toBe('Rector');
      expect(result.data?.correo).toBe('rector@reduc.edu.cu');
    });

    test('debe autenticar al usuario dir.general.extension', async () => {
      // Arrange
      const credentials = {
        username: 'dir.general.extension',
        password: '1234asdf*'
      };
      const mockUserEntry = {
        dn: 'cn=dir.general.extension,dc=reduc,dc=edu,dc=cu',
        attributes: {
          cn: 'dir.general.extension',
          displayName: 'Director General de Extension',
          mail: 'dir.general.extension@reduc.edu.cu',
          sAMAccountName: 'dir.general.extension'
        }
      };

      mockClient.search.mockResolvedValue({
        searchEntries: [mockUserEntry]
      });
      mockClient.bind.mockResolvedValue(undefined);

      // Act
      const result = await service.authenticate(credentials);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.nombre).toBe('Director General de Extension');
      expect(result.data?.correo).toBe('dir.general.extension@reduc.edu.cu');
    });
  });

  describe('searchUsers', () => {
    const searchOptions: LdapSearchOptions = {
      searchTerm: 'juan',
      limit: 10
    };

    test('debe buscar usuarios exitosamente', async () => {
      // Arrange
      const mockEntries = [
        {
          dn: 'cn=juan.perez,dc=test,dc=com',
          attributes: {
            cn: 'juan.perez',
            displayName: 'Juan Pérez',
            mail: 'juan.perez@test.com',
            department: 'TI'
          }
        },
        {
          dn: 'cn=juan.rodriguez,dc=test,dc=com',
          attributes: {
            cn: 'juan.rodriguez',
            displayName: 'Juan Rodríguez',
            mail: 'juan.rodriguez@test.com',
            department: 'RRHH'
          }
        }
      ];

      mockClient.bind.mockResolvedValue(undefined);
      mockClient.search.mockResolvedValue({
        searchEntries: mockEntries
      });

      // Act
      const result = await service.searchUsers(searchOptions);

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.users).toHaveLength(2);
      expect(result.data?.users[0].nombre).toBe('Juan Pérez');
      expect(result.data?.users[0].correo).toBe('juan.perez@test.com');
      expect(result.data?.users[1].nombre).toBe('Juan Rodríguez');
      expect(result.data?.users[1].correo).toBe('juan.rodriguez@test.com');
    });

    test('debe retornar lista vacía cuando no encuentra usuarios', async () => {
      // Arrange
      mockClient.bind.mockResolvedValue(undefined);
      mockClient.search.mockResolvedValue({
        searchEntries: []
      });

      // Act
      const result = await service.searchUsers({ searchTerm: 'noexiste' });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.users).toHaveLength(0);
      expect(result.toast).toBeNull();
    });

    test('debe usar parámetros por defecto cuando no se proporcionan', async () => {
      // Arrange
      mockClient.bind.mockResolvedValue(undefined);
      mockClient.search.mockResolvedValue({
        searchEntries: []
      });

      // Act
      const result = await service.searchUsers();

      // Assert
      expect(result.success).toBe(true);
      expect(mockClient.search).toHaveBeenCalledWith(
        expect.stringContaining('dc=test,dc=com'),
        expect.objectContaining({
          sizeLimit: 50
        })
      );
    });

    test('debe buscar usuarios del dominio', async () => {
      // Arrange
      const mockUsers = [
        {
          dn: 'cn=angel.napoles,dc=reduc,dc=edu,dc=cu',
          attributes: {
            cn: 'angel.napoles',
            displayName: 'angel.napoles',
            mail: 'angel.napoles@reduc.edu.cu',
            sAMAccountName: 'angel.napoles'
          }
        },
        {
          dn: 'cn=rector,dc=reduc,dc=edu,dc=cu',
          attributes: {
            cn: 'rector',
            displayName: 'Rector',
            mail: 'rector@reduc.edu.cu',
            sAMAccountName: 'rector'
          }
        }
      ];
      mockClient.search.mockResolvedValue({ searchEntries: mockUsers });

      // Act
      const result = await service.searchUsers({ searchTerm: 'reduc' });

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.users).toHaveLength(2);
      expect(result.data?.users?.[0].nombre).toBe('angel.napoles');
      expect(result.data?.users?.[1].correo).toBe('rector@reduc.edu.cu');
    });
  });

  describe('findUserByUsername', () => {
    test('debe encontrar un usuario por username', async () => {
      // Arrange
      const mockUserEntry = {
        dn: 'cn=testuser,dc=test,dc=com',
        attributes: {
          cn: 'testuser',
          displayName: 'Usuario de Prueba',
          mail: 'testuser@test.com',
          sAMAccountName: 'testuser',
          department: 'TI'
        }
      };

      mockClient.bind.mockResolvedValue(undefined);
      mockClient.search.mockResolvedValue({
        searchEntries: [mockUserEntry]
      });

      // Act
      const result = await service.findUserByUsername('testuser');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.metadata?.username).toBe('testuser');
      expect(result.data?.nombre).toBe('Usuario de Prueba');
      expect(result.data?.correo).toBe('testuser@test.com');
    });

    test('debe retornar null cuando el usuario no existe', async () => {
      // Arrange
      mockClient.bind.mockResolvedValue(undefined);
      mockClient.search.mockResolvedValue({
        searchEntries: []
      });

      // Act
      const result = await service.findUserByUsername('noexiste');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data).toBeNull();
      expect(result.errors).toBeNull();
    });

    test('debe manejar errores de conexión', async () => {
      // Arrange
      mockClient.bind.mockRejectedValue(new Error('Connection failed'));

      // Act
      const result = await service.findUserByUsername('testuser');

      // Assert
      expect(result.success).toBe(false);
      expect(result.data).toBeNull();
      expect(result.errors?.root).toContain('Error de conexión');
    });
  });

  describe('mapLdapUser', () => {
    test('debe mapear correctamente displayName a nombre y mail a correo', async () => {
      // Arrange
      const mockUserEntry = {
        dn: 'cn=jperez,dc=test,dc=com',
        attributes: {
          cn: 'jperez',
          displayName: 'Juan Pérez González',
          mail: 'juan.perez@universidad.cl',
          sAMAccountName: 'jperez',
          department: 'Ingeniería',
          title: 'Profesor',
          telephoneNumber: '+56912345678'
        }
      };

      mockClient.bind.mockResolvedValue(undefined);
      mockClient.search.mockResolvedValue({
        searchEntries: [mockUserEntry]
      });

      // Act
      const result = await service.findUserByUsername('jperez');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.nombre).toBe('Juan Pérez González');
      expect(result.data?.correo).toBe('juan.perez@universidad.cl');
      expect(result.data?.metadata?.username).toBe('jperez');
      expect(result.data?.metadata?.departamento).toBe('Ingeniería');
      expect(result.data?.metadata?.telefono).toBe('+56912345678');
    });

    test('debe manejar valores undefined en los campos opcionales', async () => {
      // Arrange
      const mockUserEntry = {
        dn: 'cn=testuser,dc=test,dc=com',
        attributes: {
          cn: 'testuser',
          displayName: 'Usuario Sin Datos',
          mail: 'testuser@test.com'
          // Sin campos opcionales como department, title, etc.
        }
      };

      mockClient.bind.mockResolvedValue(undefined);
      mockClient.search.mockResolvedValue({
        searchEntries: [mockUserEntry]
      });

      // Act
      const result = await service.findUserByUsername('testuser');

      // Assert
      expect(result.success).toBe(true);
      expect(result.data?.nombre).toBe('Usuario Sin Datos');
      expect(result.data?.correo).toBe('testuser@test.com');
      expect(result.data?.metadata?.departamento).toBeUndefined();
      expect(result.data?.metadata?.telefono).toBeUndefined();
    });
  });
});
