# Directorio de Servicios

Este directorio contiene los servicios de la capa de dominio de la aplicación, responsables de la lógica de negocio y la interacción con fuentes de datos externas.

## Estructura de Respuesta Estándar

Todos los métodos de servicio que realizan una operación (crear, actualizar, eliminar, autenticar, etc.) deben devolver un objeto que siga la siguiente estructura estándar. Esto garantiza la consistencia en el manejo de datos, errores y notificaciones en toda la aplicación.

```typescript
interface ServiceResponse<T> {
  /**
   * Indica si la operación fue exitosa.
   */
  success: boolean;

  /**
   * Contiene los datos devueltos en caso de éxito. Es `null` si la operación falló.
   */
  data: T | null;

  /**
   * Contiene información sobre los errores, si los hubo. Es `null` si la operación fue exitosa.
   */
  errors: {
    /**
     * Errores generales no asociados a un campo específico (ej: "Error de conexión con la base de datos").
     */
    root?: string;
    /**
     * Errores de validación asociados a campos específicos.
     */
    fields?: {
      [fieldName: string]: string[];
    };
  } | null;

  /**
   * Objeto para mostrar notificaciones (toasts) en la interfaz de usuario. Puede ser `null`.
   */
  toast: {
    title: string;
    description: string;
    type: 'info' | 'warning' | 'success' | 'error';
  } | null;
}
```

---

## LdapService

El `LdapService` encapsula toda la lógica para interactuar con un servidor LDAP (o Active Directory). Está diseñado siguiendo los principios de Clean Architecture y SOLID para asegurar un código desacoplado, mantenible y testeable.

### Responsabilidades

-   **Autenticación de usuarios**: Verifica las credenciales de un usuario contra el servidor LDAP.
-   **Búsqueda de usuarios**: Permite realizar búsquedas de usuarios en el directorio.
-   **Mapeo de datos**: Transforma los datos crudos de LDAP a un modelo de dominio (`LdapUser`) consistente para la aplicación.

### Arquitectura y Diseño

-   **Inversión de Dependencias (DIP)**: Se define una interfaz `ILdapService` que desacopla la implementación concreta (`LdapService`) del resto de la aplicación. Esto facilita la sustitución y el testing.
-   **Inyección de Dependencias**: La configuración y el logger se inyectan en el constructor, permitiendo flexibilidad y control en diferentes entornos.
-   **Factory Pattern**: Se utiliza `LdapServiceFactory` para simplificar la creación de instancias del servicio, proveyendo un método (`createFromEnv`) que configura el servicio a partir de variables de entorno.
-   **Manejo de Errores Estructurado**: Las respuestas del servicio se adhieren a la `ServiceResponse` estándar para un manejo de errores predecible.

### Métodos Principales

#### `authenticate(credentials: LdapCredentials): Promise<ServiceResponse<LdapUser>>`

1.  **Búsqueda Segura**: Primero, realiza una búsqueda del usuario con un bind administrativo para obtener su `DN` (Distinguished Name).
2.  **Autenticación**: Si el usuario es encontrado, intenta realizar un `bind` con el `DN` del usuario y la contraseña proporcionada.
3.  **Respuesta**: Devuelve un objeto `ServiceResponse<LdapUser>` con el resultado.
    -   En caso de éxito, `data` contiene el objeto `LdapUser`.
    -   En caso de fallo, `errors` contiene los detalles del error.

#### `searchUsers(options: LdapSearchOptions): Promise<ServiceResponse<{ users: LdapUser[], total: number }>>`

-   Permite buscar usuarios con un término de búsqueda que se aplica sobre los campos `cn`, `displayName`, `mail` y `sAMAccountName`.
-   Acepta opciones para limitar el número de resultados y definir un filtro personalizado.
-   Devuelve un `ServiceResponse` donde `data` contiene una lista de usuarios (`LdapUser[]`) y el total de resultados.

#### `findUserByUsername(username: string): Promise<ServiceResponse<LdapUser>>`

-   Busca un único usuario por su `sAMAccountName`, `cn` o `uid`.
-   Es utilizado internamente por `authenticate` pero también puede ser usado directamente.
-   Devuelve un `ServiceResponse` con el usuario en `data` si se encuentra.

### Mapeo de Datos

El servicio aplica una lógica de negocio específica al mapear los atributos de LDAP al modelo `LdapUser`:

-   `nombre`: Se obtiene del atributo `displayName` de LDAP.
-   `correo`: Se obtiene del atributo `mail` de LDAP.

### Configuración y Uso

La forma recomendada de instanciar el servicio es a través del `LdapServiceFactory`, que puede leer la configuración desde las variables de entorno.

**Ejemplo de uso:**

```typescript
import { LdapServiceFactory } from './ldap.service';

const ldapService = LdapServiceFactory.createFromEnv();

async function login(username, password) {
  const response = await ldapService.authenticate({ username, password });
  if (response.success) {
    console.log('Bienvenido', response.data.nombre);
  } else {
    console.error('Error:', response.errors.root);
  }
}
```

**Variables de entorno requeridas:**

-   `LDAP_URL`: URL del servidor LDAP (ej: `ldap://localhost:389`).
-   `LDAP_BASE_DN`: DN base para las búsquedas (ej: `dc=reduc,dc=edu,dc=cu`).
-   `LDAP_BIND_DN`: DN del usuario administrativo para realizar búsquedas (ej: `cn=admin,dc=reduc,dc=edu,dc=cu`).
-   `LDAP_BIND_PASSWORD`: Contraseña del usuario administrativo.
-   `LDAP_USER_FILTER`: Filtro base para identificar a los usuarios (ej: `(objectClass=person)`).
-   `LDAP_USER_ATTRIBUTES`: Atributos a solicitar en las búsquedas.
-   `LDAP_TIMEOUT`: Tiempo de espera para las operaciones LDAP.
