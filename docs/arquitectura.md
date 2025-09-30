# Arquitectura del Sistema - Agenda UC

## Stack Tecnológico

### Frontend
- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Framework de estilos utilitarios
- **HeroUI**: Componentes de interfaz
- **Sonner**: Sistema de notificaciones toast

### Backend
- **Next.js API Routes**: Endpoints RESTful
- **Prisma**: ORM y migraciones de base de datos
- **Zod**: Validación de esquemas y tipos

### Base de Datos
- **PostgreSQL**: Base de datos principal (producción)
- **SQLite**: Base de datos para desarrollo

### Autenticación
- **NextAuth.js**: Manejo de sesiones
- **Keycloak**: Proveedor de identidad
- **LDAP/Samba**: Directorio de usuarios

### Infraestructura
- **Docker**: Contenedorización
- **Docker Compose**: Orquestación de servicios

## Arquitectura de Capas

### Presentación
- **Componentes React**: UI/UX
- **Hooks personalizados**: Lógica de estado
- **Layouts**: Estructura de páginas

### API
- **Route Handlers**: Endpoints HTTP
- **Middleware**: Autenticación y validación
- **DTOs**: Transferencia de datos

### Negocio
- **Servicios de Dominio**: Lógica de negocio
- **Validación**: Esquemas Zod
- **Manejo de Errores**: Sistema centralizado

### Datos
- **Prisma Client**: Acceso a datos
- **Modelos**: Esquema de base de datos
- **Migraciones**: Versionado de esquema

## Patrones de Diseño

### Service Layer
- Servicios de dominio encapsulan lógica de negocio
- Ejemplo: [`UsuarioService`](../framework/services/domain/usuarioService.ts)

### DTO Pattern
- Objetos de transferencia de datos tipados
- Validación con esquemas Zod
- Separación clara entre capas

### Repository Pattern
- Acceso a datos a través de Prisma
- Abstracción de operaciones CRUD

### Error Handling
- Sistema centralizado de manejo de errores
- Errores específicos por campo
- Notificaciones contextuales

## Estructura de Directorios

```
framework/
├── app/                    # Next.js App Router
├── components/            # Componentes React
├── dtos/                  # Data Transfer Objects
├── hooks/                 # Custom React Hooks
├── lib/                   # Utilidades y configuración
├── prisma/                # Esquema y migraciones
├── schemas/               # Validación con Zod
├── services/              # Servicios de dominio
└── types/                 # Definiciones de tipos
```

## Seguridad

### Autenticación
- OAuth 2.0 con Keycloak
- JWT tokens para sesiones
- Integración LDAP para usuarios

### Autorización
- Sistema de roles híbrido
- Permisos basados en contexto
- Validación en cada endpoint

### Validación
- Esquemas Zod en frontend y backend
- Sanitización de entradas
- Validación de tipos TypeScript

## Escalabilidad

### Base de Datos
- Índices optimizados
- Consultas eficientes con Prisma
- Paginación para listados

### Cacheo
- *Por implementar según necesidades*

### Performance
- Static Site Generation donde aplique
- Optimización de imágenes con Next.js
- Bundle splitting automático

## Monitoreo

### Logs
- Registro de errores centralizado
- Trazabilidad de operaciones críticas
- Auditoría de cambios

### Métricas
- *Por implementar según necesidades*

## Deployment

### Desarrollo
```bash
docker compose up -d
```

### Producción
- *Configuración por definir*