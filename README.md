# Agenda UC

Sistema integral de gestión de reservas y aseguramientos para la Universidad de Ciego de Ávila.

## 📋 Descripción

Agenda UC es una plataforma web que permite a la comunidad universitaria gestionar reservas de espacios, solicitar aseguramientos logísticos para eventos, y mantener calendarios organizacionales de manera eficiente y centralizada.

### Características Principales

- 🔐 **Autenticación integrada** con LDAP/Keycloak
- 👥 **Sistema híbrido de roles** (base + calculados dinámicamente)
- 📅 **Múltiples calendarios** (personal, recursos, universitario)
- 🏛️ **Gestión de reservas** con flujos de aprobación
- 📦 **Órdenes de aseguramiento** para eventos
- 🔍 **Trazabilidad completa** de operaciones
- 📱 **Interface responsive** y moderna

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** con App Router
- **TypeScript** para tipado estático
- **Tailwind CSS** para estilos
- **HeroUI** para componentes
- **Sonner** para notificaciones

### Backend
- **Next.js API Routes** para endpoints REST
- **Prisma** como ORM
- **Zod** para validación de esquemas

### Base de Datos
- **PostgreSQL** (producción)
- **SQLite** (desarrollo)

### Autenticación
- **NextAuth.js** para manejo de sesiones
- **Keycloak** como proveedor de identidad
- **LDAP/Samba** para directorio de usuarios

### Infraestructura
- **Docker** y **Docker Compose** para contenedorización

## 🚀 Instalación Rápida

### Prerrequisitos
- Docker y Docker Compose
- Node.js 18+ (para desarrollo local)
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/angelqva/agenda-uc.git
   cd agenda-uc
   ```

2. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus configuraciones específicas
   ```

3. **Levantar los servicios**
   ```bash
   docker compose up -d
   ```

4. **Configurar la base de datos**
   ```bash
   # Ejecutar desde el contenedor de la app
   docker exec -it agenda_app_dev sh
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Acceder a la aplicación**
   - **App principal**: http://localhost:3000
   - **Keycloak Admin**: http://localhost:8080 (admin/admin)
   - **PostgreSQL**: localhost:5432 (agenda_user/agenda_pass)

## 📁 Estructura del Proyecto

```
agenda-uc/
├── framework/              # Aplicación Next.js principal
│   ├── app/               # Next.js App Router
│   ├── components/        # Componentes React
│   ├── dtos/             # Data Transfer Objects
│   ├── hooks/            # Custom React Hooks
│   ├── lib/              # Utilidades y configuración
│   ├── prisma/           # Esquema y migraciones
│   ├── schemas/          # Validación con Zod
│   ├── services/         # Servicios de dominio
│   └── types/            # Definiciones de tipos
├── docs/                  # Documentación del proyecto
├── samba/                # Configuración LDAP/Samba
├── secrets/              # Archivos de secretos
└── docker-compose.yml    # Configuración de servicios
```

## 📚 Documentación

La documentación completa está disponible en la carpeta [`/docs`](./docs/):

- **[Casos de Uso y Flujos](./docs/casos-flujos.md)**: Funcionalidades y flujos del sistema
- **[Modelos de Datos](./docs/modelos.md)**: Estructura de la base de datos
- **[Sistema de Roles](./docs/roles.md)**: Gestión de permisos y roles
- **[Calendario](./docs/calendario.md)**: Funcionalidades del calendario
- **[Aseguramientos](./docs/aseguramientos.md)**: Sistema de órdenes logísticas
- **[Arquitectura](./docs/arquitectura.md)**: Decisiones técnicas y patrones
- **[API Reference](./docs/api.md)**: Documentación de endpoints
- **[Roadmap](./docs/roadmap.md)**: Hoja de ruta del proyecto

## 🔧 Desarrollo

### Comandos Útiles

```bash
# Desarrollo local
npm run dev

# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Ver base de datos (Prisma Studio)
npx prisma studio

# Linting y formateo
npm run lint
npm run format
```

### Estructura de Branches

- `main`: Rama principal (producción)
- `develop`: Rama de desarrollo
- `feature/*`: Nuevas funcionalidades
- `hotfix/*`: Correcciones urgentes

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'feat: agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

### Convenciones de Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bugs
- `docs:` Cambios en documentación
- `chore:` Tareas de mantenimiento
- `refactor:` Refactoring de código

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Equipo

- **Universidad de Ciego de Ávila** - Cliente y sponsor
- **Equipo de Desarrollo** - Implementación y mantenimiento

## 📞 Soporte

Para soporte técnico o consultas:
- 📧 Email: soporte@uc.edu.cu
- 📋 Issues: [GitHub Issues](https://github.com/angelqva/agenda-uc/issues)

---

**Agenda UC** - Transformando la gestión universitaria con tecnología moderna 🎓