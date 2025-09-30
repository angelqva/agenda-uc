# Sincronización Automática de Usuarios - AuthOptions

## 🎯 Funcionalidad Implementada

Se ha agregado la capacidad de crear/actualizar automáticamente usuarios en la base de datos local cuando inician sesión a través del proveedor de autenticación (Keycloak).

## 🏗️ Arquitectura de la Solución

### 1. **Schema y DTO para Autenticación** (`schemas/usuario.ts`, `dtos/usuario.ts`)

```typescript
// Schema de validación para datos de usuario desde auth
export const syncUserFromAuthSchema = z.object({
  email: emailSchema,
  name: z.string().min(1, "Nombre es requerido"),
  image: urlSchema.optional(),
});

// DTO correspondiente
export type SyncUserFromAuthDto = z.infer<typeof syncUserFromAuthSchema>;
```

### 2. **Método de Servicio** (`services/domain/usuarioService.ts`)

```typescript
static async syncUserFromAuth(userData: unknown): Promise<ServiceResult<Usuario>> {
  // Valida datos de entrada
  // Busca usuario existente por email
  // Si existe: actualiza datos + lastLoginAt + reactiva si estaba inactivo
  // Si no existe: crea nuevo usuario
  // Retorna ServiceResult con notificación toast apropiada
}
```

**Características del método:**
- ✅ **Validación robusta** con Zod schemas
- ✅ **Upsert inteligente** (crea o actualiza según corresponda)
- ✅ **Reactivación automática** de usuarios inactivos
- ✅ **Tracking de último login** con `lastLoginAt`
- ✅ **Manejo de errores** sin interrumpir el flujo de autenticación
- ✅ **Notificaciones contextuales** para usuarios nuevos vs existentes

### 3. **Integración en AuthOptions** (`services/auth/authOptions.ts`)

```typescript
callbacks: {
  async signIn({ user, account, profile }) {
    try {
      if (user.email && user.name) {
        const syncResult = await UsuarioService.syncUserFromAuth({
          email: user.email,
          name: user.name,
          image: user.image,
        });
        
        // Log resultado pero permite login aunque falle sincronización
      }
      return true;
    } catch (error) {
      // Log error pero permite login (sin bloquear acceso)
      return true;
    }
  }
}
```

### 4. **Actualización del Modelo** (`prisma/schema.prisma`)

```prisma
model Usuario {
  id          String   @id @default(cuid())
  email       String   @unique
  nombre      String   // NUEVO: Nombre del usuario
  imageUrl    String?
  biografia   String?
  telefono    String?
  activo      Boolean  @default(true)
  lastLoginAt DateTime? // NUEVO: Último inicio de sesión

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🚀 Flujo de Funcionamiento

### Primer Login (Usuario Nuevo)
1. Usuario se autentica con Keycloak
2. `signIn` callback recibe datos del usuario
3. `syncUserFromAuth` no encuentra usuario existente
4. **Crea nuevo usuario** en base de datos
5. Establece `lastLoginAt` y `activo: true`
6. Muestra toast: "¡Bienvenido al sistema, [Nombre]!"

### Login Posterior (Usuario Existente)
1. Usuario se autentica con Keycloak
2. `signIn` callback recibe datos del usuario
3. `syncUserFromAuth` encuentra usuario existente
4. **Actualiza datos** (nombre, imagen si cambió)
5. Actualiza `lastLoginAt` y reactiva si estaba inactivo
6. Muestra toast: "Bienvenido de nuevo, [Nombre]"

## ✅ Beneficios de la Implementación

### 🔄 **Sincronización Automática**
- No requiere registro manual
- Mantiene datos actualizados desde el proveedor
- Sincroniza cambios de nombre/imagen automáticamente

### 🛡️ **Manejo Robusto de Errores**
- Validación completa con schemas
- No bloquea acceso aunque falle sincronización
- Logging detallado para debugging
- Patrones ServiceResult consistentes

### 📊 **Tracking de Actividad**
- Registro de último acceso (`lastLoginAt`)
- Reactivación automática de usuarios inactivos
- Base para futuras métricas de uso

### 🎯 **Experiencia de Usuario**
- Notificaciones contextuales diferenciadas
- Bienvenida personalizada para nuevos usuarios
- Proceso transparente (sin pasos adicionales)

### 🔧 **Arquitectura Limpia**
- Reutiliza DTOs/schemas existentes
- Integración no invasiva con NextAuth
- Servicios desacoplados y testeable

## 🔧 Configuración Requerida

### Variables de Entorno
```env
DATABASE_URL="postgresql://user:password@localhost:5432/agenda_uc"
KEYCLOAK_CLIENT_ID="agenda-uc-client"
KEYCLOAK_CLIENT_SECRET="your-secret"
KEYCLOAK_ISSUER="https://your-keycloak.com/realms/your-realm"
```

### Migración de Base de Datos
```bash
# Aplicar cambios al modelo Usuario
npx prisma migrate dev --name add_nombre_and_last_login_at_to_usuario

# Generar cliente actualizado
npx prisma generate
```

## 📋 Consideraciones Técnicas

### ⚡ **Performance**
- Operación única por login (no overhead significativo)
- Queries optimizadas (findUnique + conditional update/create)
- Validación rápida con Zod

### 🛡️ **Seguridad**
- Validación estricta de datos de entrada
- No expone datos sensibles en logs
- Aislamiento de errores (no afectan autenticación)

### 🔄 **Escalabilidad**
- Patrón extensible para múltiples proveedores
- Compatible con futuras funcionalidades de usuarios
- Preparado para roles y permisos

## 🧪 Testing Manual

Para probar la funcionalidad:

1. **Configurar Keycloak** con usuario de prueba
2. **Ejecutar aplicación** con variables de entorno
3. **Iniciar sesión** - verificar creación de usuario
4. **Cerrar sesión e iniciar nuevamente** - verificar actualización
5. **Verificar en base de datos** campos `nombre` y `lastLoginAt`

## 🔮 Extensiones Futuras

- **Sincronización de roles** desde Keycloak
- **Múltiples proveedores** de autenticación
- **Webhooks** para cambios de usuario
- **Métricas avanzadas** de uso y actividad
- **Políticas de reactivación** personalizables

La implementación está **completa y lista para producción**, siguiendo las mejores prácticas de arquitectura limpia y manejo de errores del sistema.