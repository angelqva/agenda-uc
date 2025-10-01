# Sistema de Autenticación LDAP + JWT

## Descripción del Flujo

Este módulo implementa un sistema de autenticación híbrido que combina autenticación LDAP con gestión de sesiones mediante JWT almacenados en cookies seguras.

### Arquitectura del Sistema

```
[Frontend] ← HTTP/HTTPS → [NestJS API] ← LDAP → [Servidor LDAP]
     ↓                          ↓
[Cookie JWT]                [PostgreSQL]
```

### Flujo de Autenticación

1. **Login**:
   - Usuario envía `username` y `password` a `POST /auth/ldap/login`
   - El sistema valida credenciales contra servidor LDAP
   - Si es válido, busca o crea el usuario en PostgreSQL
   - Recupera roles del usuario desde la base de datos
   - Genera JWT con payload: `{ id, email, roles }`
   - Devuelve JWT en cookie `httpOnly`, `secure`, `sameSite=strict`
   - Registra traza `LOGIN_LDAP` en `TrazaGeneral`

2. **Logout**:
   - Usuario envía `POST /auth/ldap/logout`
   - Sistema limpia la cookie de autenticación
   - Registra traza `LOGOUT_LDAP` en `TrazaGeneral`

3. **Acceso a recursos protegidos**:
   - Middleware `JwtAuthGuard` valida JWT desde cookie
   - Verifica que el usuario existe y es válido
   - Inyecta información del usuario en el request

## Justificación de la Implementación

### ¿Por qué LDAP + JWT en cookies?

#### Ventajas sobre NextAuth.js:
- **Control total**: Manejo completo del flujo de autenticación
- **Integración perfecta**: Con el sistema de roles de la base de datos
- **Auditoría completa**: Todas las acciones se registran en `TrazaGeneral`
- **Flexibilidad**: Fácil personalización para requisitos específicos
- **Sin dependencias externas**: No requiere proveedores de OAuth adicionales

#### Ventajas sobre JWT en localStorage:
- **Seguridad**: Cookies `httpOnly` previenen acceso desde JavaScript malicioso
- **Automático**: Se envían automáticamente con cada request
- **CSRF Protection**: `sameSite=strict` previene ataques CSRF

#### Ventajas sobre sesiones en servidor:
- **Escalabilidad**: No requiere almacenamiento de sesiones en servidor
- **Stateless**: Cada request contiene toda la información necesaria
- **Performance**: No consulta de sesión en cada request

## Buenas Prácticas Implementadas

### 🔒 Seguridad

1. **Cookies Seguras**:
   ```typescript
   COOKIE_CONFIG: {
     httpOnly: true,          // No accesible desde JavaScript
     secure: true,            // Solo HTTPS (producción)
     sameSite: 'strict',      // Previene CSRF
     maxAge: 30 * 60 * 1000,  // 30 minutos
     path: '/',
   }
   ```

2. **TTL Corto en Tokens**:
   - Tokens expiran en 30 minutos
   - Reduce ventana de exposición en caso de compromiso
   - Implementación preparada para refresh tokens si es necesario

3. **Validaciones Estrictas**:
   - Validación de entrada con Zod
   - Verificación de existencia de usuario en cada request
   - Logs de seguridad para auditoría

### 🔄 Manejo de Múltiples Roles

```typescript
// Los roles se almacenan en la base de datos
model UsuarioRol {
  usuarioId String
  rol       RolBase
  usuario   Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@id([usuarioId, rol])
}

// Y se incluyen en el JWT
const payload: JwtPayload = {
  id: user.id,
  email: user.email,
  roles: ['ADMINISTRADOR', 'RESPONSABLE_LOCAL'] // Múltiples roles
};
```

### 📊 Auditoría y Trazabilidad

Todas las acciones críticas se registran en `TrazaGeneral`:

```typescript
enum AuthTraceType {
  LOGIN_LDAP = 'LOGIN_LDAP',
  LOGOUT_LDAP = 'LOGOUT_LDAP',
  LOGIN_FAILED_LDAP = 'LOGIN_FAILED_LDAP',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
}
```

### 📝 Validaciones con Zod

```typescript
export const LoginDtoSchema = z.object({
  username: z
    .string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(50, 'El username no puede tener más de 50 caracteres')
    .regex(/^[a-zA-Z0-9._-]+$/, 'Username contiene caracteres inválidos'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .max(200, 'La contraseña es demasiado larga'),
});
```

### 🔍 Logs Estructurados

```typescript
this.logger.log(`Login exitoso para usuario: ${username} (ID: ${user.id})`);
this.logger.warn(`Credenciales incorrectas para usuario: ${username}`);
this.logger.error(`Error en login LDAP para usuario ${username}:`, error);
```

## API Reference

### POST /auth/ldap/login

Autenticar usuario con credenciales LDAP.

#### Request:
```json
{
  "username": "juan.perez",
  "password": "secretpassword"
}
```

#### Response (200):
```json
{
  "success": true,
  "message": "Login exitoso",
  "user": {
    "id": "clkj2h3g40000...",
    "name": "Juan Pérez",
    "email": "juan.perez@reduc.edu.cu",
    "roles": ["ADMINISTRADOR", "RESPONSABLE_LOCAL"],
    "sede": null
  }
}
```

#### Response (401):
```json
{
  "success": false,
  "message": "Credenciales incorrectas"
}
```

#### Headers:
- Se establece cookie `auth_token` con JWT

---

### POST /auth/ldap/logout

Cerrar sesión del usuario autenticado.

#### Headers:
- Requiere cookie `auth_token` válida

#### Response (200):
```json
{
  "success": true,
  "message": "Logout exitoso"
}
```

#### Side Effects:
- Limpia cookie `auth_token`
- Registra traza de logout

---

### GET /auth/profile

Obtener perfil del usuario autenticado.

#### Headers:
- Requiere cookie `auth_token` válida

#### Response (200):
```json
{
  "id": "clkj2h3g40000...",
  "name": "Juan Pérez",
  "email": "juan.perez@reduc.edu.cu",
  "roles": ["ADMINISTRADOR", "RESPONSABLE_LOCAL"],
  "sede": null
}
```

#### Response (401):
```json
{
  "message": "Token de acceso requerido"
}
```

---

### GET /auth/check

Verificar estado de autenticación.

#### Headers:
- Requiere cookie `auth_token` válida

#### Response (200):
```json
{
  "authenticated": true,
  "user": {
    "id": "clkj2h3g40000...",
    "email": "juan.perez@reduc.edu.cu",
    "name": "Juan Pérez",
    "roles": ["ADMINISTRADOR", "RESPONSABLE_LOCAL"]
  }
}
```

## Consideraciones de Seguridad

### 🛡️ Protección contra XSS
- Cookies `httpOnly` no son accesibles desde JavaScript
- Validación estricta de entrada con Zod
- Escape automático en logs

### 🔒 Protección contra CSRF
- Cookies `sameSite=strict` previenen requests cross-site
- Tokens con TTL corto reducen ventana de ataque

### ⏰ Expiración de Tokens
- JWT expira en 30 minutos
- Cookie expira automáticamente
- Implementación preparada para refresh tokens

### 🚫 Invalidación de Tokens
- Logout limpia cookie inmediatamente
- Preparado para blacklist de tokens si es necesario

### 🌐 Consideraciones HTTPS
- En producción, cookies `secure=true` requieren HTTPS
- Headers de seguridad recomendados:
  ```
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  ```

### 📊 Monitoreo y Auditoría
- Todos los intentos de login se registran
- Logs incluyen IP del cliente
- Trazas almacenadas para auditoría posterior

## Variables de Entorno Requeridas

```bash
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters
NODE_ENV=development

# LDAP Configuration
LDAP_URL=ldap://localhost:389
LDAP_BIND_DN=cn=ldap.search,ou=usuarios,dc=reduc,dc=edu,dc=cu
LDAP_BIND_PASSWORD=ldap123
LDAP_BASE_DN=ou=usuarios,dc=reduc,dc=edu,dc=cu

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/agenda_uc?schema=public"
```

## Deployment y Escalabilidad

### 🚀 Preparación para Producción
1. Cambiar `JWT_SECRET` por uno seguro (min 32 caracteres)
2. Configurar `NODE_ENV=production`
3. Habilitar HTTPS
4. Configurar rate limiting
5. Configurar monitoreo de logs

### 📈 Escalabilidad
- Sistema stateless permite múltiples instancias
- JWT elimina necesidad de almacenamiento centralizado de sesiones
- Cache de roles puede implementarse si es necesario

### 🔧 Mantenimiento
- Rotación periódica de `JWT_SECRET`
- Monitoreo de intentos de login fallidos
- Auditoría regular de logs de seguridad