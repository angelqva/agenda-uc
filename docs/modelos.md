# Modelos de Base de Datos - Agenda UC

## Configuración de Prisma

### Generador
El proyecto utiliza el generador estándar `prisma-client-js` para máxima compatibilidad:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

**Ventajas del generador estándar:**
- **Compatibilidad**: Funciona perfectamente con CommonJS y la mayoría de frameworks
- **Estabilidad**: Generador maduro y ampliamente probado
- **Integración**: Se instala automáticamente en `node_modules/@prisma/client`
- **Sin configuración**: No requiere configuración adicional de paths

### Importaciones
```typescript
// Cliente principal
import { PrismaClient } from '@prisma/client';

// Tipos generados automáticamente disponibles
import type { Usuario, Reserva, Prisma } from '@prisma/client';
```

## Características del Schema

Este archivo contiene el schema completo de Prisma para el sistema de gestión de reservas de la Universidad de Ciencias Informáticas.

### 🔧 Características Principales:

- **Base de datos**: PostgreSQL
- **ORM**: Prisma 
- **Generación de IDs**: CUID (Collision-resistant Universal Identifier)
- **Auditoría**: Sistema completo de trazabilidad
- **Relaciones**: Configuradas con integridad referencial

### ⚠️ Notas Importantes:

- Los campos `actorId` en las tablas de trazabilidad son opcionales (`String?`) para permitir auditoría de acciones del sistema
- Las relaciones de auditoría usan `onDelete: SetNull` para preservar el historial cuando se eliminen usuarios
- Todos los timestamps incluyen `createdAt` y `updatedAt` automáticos

---

```markdown

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ==========================================
// ENUMS
// ==========================================

enum RolBase {
  RECTOR
  DIRECTIVO_INSTITUCIONAL
  DIRECTIVO
  ALMACENERO
  RESPONSABLE_LOCAL
  RESPONSABLE_MEDIO
  ADMINISTRADOR
  LOGISTICO
}

enum EstadoReserva {
  CREADO
  REVISADA
  APROBADO
  CANCELADO
}

enum EstadoSolicitud {
  PENDIENTE
  APROBADA
  RECHAZADA
}

enum EstadoOrden {
  CREADO
  REVISADA
  APROBADO
  CANCELADO
}

enum EstadoEnvio {
  PENDIENTE
  ENVIADO
  FALLIDO
  REENVIADO
}

// ==========================================
// USUARIOS Y ROLES
// ==========================================

model Usuario {
  id          String   @id @default(cuid())
  email       String   @unique
  name        String
  imageUrl    String?
  activo      Boolean  @default(true)
  lastLoginAt DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  roles UsuarioRol[]

  responsableLocales ResponsableLocal[]
  responsableMedios  ResponsableMedio[]
  directivoAreas     DirectivoArea[]
  administradorAreas AdministradorArea[]

  actividadesCreadas Actividad[] @relation("ActividadCreador")
  eventosCreados     Evento[]    @relation("EventoCreador")
  reservasSolicitadas Reserva[]  @relation("ReservaSolicitante")
  reservasPreside    Reserva[]   @relation("ReservaPreside")

  solicitudesPublicasCreadas  SolicitudEventoPublico[] @relation("SolicitudPublicaSolicitante")
  solicitudesPublicasRevisadas SolicitudEventoPublico[] @relation("SolicitudPublicaRevisor")

  ordenesCreadas     OrdenAseguramiento[] @relation("OrdenCreador")
  ordenesRevisadas   OrdenAseguramiento[] @relation("OrdenRevisor")
  ordenesModificadas OrdenAseguramiento[] @relation("OrdenModificador")

  notificaciones Notificacion[] @relation("NotificacionDestinatario")

  trazasGenerales TrazaGeneral[]
  trazasReservas  TrazaReserva[]
  trazasOrdenes   TrazaOrdenAseguramiento[]

  @@map("usuarios")
}

model UsuarioRol {
  usuarioId String
  rol       RolBase
  usuario   Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)

  @@id([usuarioId, rol])
  @@map("usuario_roles")
}

// ==========================================
// SEDES Y ÁREAS
// ==========================================

model Sede {
  id        String  @id @default(cuid())
  nombre    String  @unique
  ubicacion String?

  areas   SedeArea[]
  locales Local[]

  @@map("sedes")
}

model Area {
  id     String @id @default(cuid())
  codigo String @unique
  nombre String

  sedes   SedeArea[]
  locales Local[]
  medios  Medio[]

  directivos      DirectivoArea[]
  administradores AdministradorArea[]

  @@map("areas")
}

model SedeArea {
  sedeId String
  areaId String

  sede Sede @relation(fields: [sedeId], references: [id], onDelete: Cascade)
  area Area @relation(fields: [areaId], references: [id], onDelete: Cascade)

  @@id([sedeId, areaId])
  @@map("sede_areas")
}

// ==========================================
// LOCALES Y MEDIOS
// ==========================================

model Local {
  id        String @id @default(cuid())
  codigo    String @unique
  nombre    String
  capacidad Int

  areaId String
  area   Area @relation(fields: [areaId], references: [id], onDelete: Restrict)

  sedeId String
  sede   Sede @relation(fields: [sedeId], references: [id], onDelete: Restrict)

  reservas Reserva[]
  eventos  Evento[]
  medios   Medio[]

  responsables ResponsableLocal[]

  @@map("locales")
}

model Medio {
  id          String @id @default(cuid())
  codigo      String @unique
  nombre      String
  descripcion String?

  localId String
  local   Local @relation(fields: [localId], references: [id], onDelete: Cascade)

  areaId String
  area   Area  @relation(fields: [areaId], references: [id], onDelete: Restrict)

  reservas Reserva[]
  eventos  Evento[]

  responsables ResponsableMedio[]

  @@map("medios")
}

model ResponsableLocal {
  usuarioId String
  localId   String
  usuario   Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  local     Local   @relation(fields: [localId], references: [id], onDelete: Cascade)

  @@id([usuarioId, localId])
  @@map("responsables_local")
}

model ResponsableMedio {
  usuarioId String
  medioId   String
  usuario   Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  medio     Medio   @relation(fields: [medioId], references: [id], onDelete: Cascade)

  @@id([usuarioId, medioId])
  @@map("responsables_medio")
}

model DirectivoArea {
  usuarioId String
  areaId    String
  usuario   Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  area      Area    @relation(fields: [areaId], references: [id], onDelete: Cascade)

  @@id([usuarioId, areaId])
  @@map("directivos_area")
}

model AdministradorArea {
  usuarioId String
  areaId    String
  usuario   Usuario @relation(fields: [usuarioId], references: [id], onDelete: Cascade)
  area      Area    @relation(fields: [areaId], references: [id], onDelete: Cascade)

  @@id([usuarioId, areaId])
  @@map("administradores_area")
}

// ==========================================
// ACTIVIDADES
// ==========================================

model TipoActividad {
  id        String   @id @default(cuid())
  nombre    String   @unique
  icono     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  actividades Actividad[]

  @@map("tipos_actividad")
}

model Actividad {
  id          String   @id @default(cuid())
  nombre      String
  descripcion String?

  creadorId String
  creador   Usuario  @relation("ActividadCreador", fields: [creadorId], references: [id], onDelete: Restrict)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  tipoId String
  tipo   TipoActividad @relation(fields: [tipoId], references: [id], onDelete: Restrict)

  eventos Evento[]

  @@map("actividades")
}

// ==========================================
// EVENTOS, RESERVAS Y SOLICITUDES
// ==========================================

model Evento {
  id     String   @id @default(cuid())
  inicio DateTime
  fin    DateTime

  creadorId String
  creador   Usuario @relation("EventoCreador", fields: [creadorId], references: [id], onDelete: Restrict)

  actividadId String?
  actividad   Actividad? @relation(fields: [actividadId], references: [id], onDelete: SetNull)

  localId String?
  local   Local?  @relation(fields: [localId], references: [id], onDelete: SetNull)

  medioId String?
  medio   Medio?  @relation(fields: [medioId], references: [id], onDelete: SetNull)

  eventoReferenciaId String?
  eventoReferencia   Evento?  @relation("RecordatorioDeEvento", fields: [eventoReferenciaId], references: [id], onDelete: SetNull)
  recordatorios      Evento[] @relation("RecordatorioDeEvento")

  solicitudPublica     SolicitudEventoPublico?
  reservaDetalle       Reserva?
  ordenesAseguramiento OrdenAseguramiento[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("eventos")
}

model Reserva {
  id          String @id @default(cuid())
  eventoId    String @unique
  evento      Evento @relation(fields: [eventoId], references: [id], onDelete: Cascade)

  participantes Int
  estado        EstadoReserva @default(CREADO)

  solicitanteId String
  solicitante   Usuario @relation("ReservaSolicitante", fields: [solicitanteId], references: [id], onDelete: Restrict)

  presideId String?
  preside   Usuario? @relation("ReservaPreside", fields: [presideId], references: [id], onDelete: SetNull)

  trazas  TrazaReserva[]

  localId String?
  Local   Local?  @relation(fields: [localId], references: [id], onDelete: SetNull)
  medioId String?
  Medio   Medio?  @relation(fields: [medioId], references: [id], onDelete: SetNull)

  @@map("reservas")
}

model SolicitudEventoPublico {
  id       String          @id @default(cuid())
  estado   EstadoSolicitud @default(PENDIENTE)
  notas    String?

  solicitanteId String
  solicitante   Usuario @relation("SolicitudPublicaSolicitante", fields: [solicitanteId], references: [id], onDelete: Restrict)

  revisorId   String?
  revisor     Usuario? @relation("SolicitudPublicaRevisor", fields: [revisorId], references: [id], onDelete: SetNull)

  eventoId String @unique
  evento   Evento @relation(fields: [eventoId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("solicitudes_eventos_publicos")
}

// ==========================================
// ASEGURAMIENTOS
// ==========================================

model OrdenAseguramiento {
  id     String      @id @default(cuid())
  estado EstadoOrden @default(CREADO)

  creadorId    String
  creador      Usuario @relation("OrdenCreador", fields: [creadorId], references: [id], onDelete: Restrict)

  revisorId    String?
  revisor      Usuario? @relation("OrdenRevisor", fields: [revisorId], references: [id], onDelete: SetNull)

  modificadorId String?
  modificador   Usuario? @relation("OrdenModificador", fields: [modificadorId], references: [id], onDelete: SetNull)

  notas String?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  eventoId String
  evento   Evento @relation(fields: [eventoId], references: [id], onDelete: Cascade)

  detalles Aseguramiento[]
  trazas   TrazaOrdenAseguramiento[]

  @@map("ordenes_aseguramiento")
}

model Aseguramiento {
  id       String  @id @default(cuid())
  cantidad Int
  detalles String?

  ordenId String
  orden   OrdenAseguramiento @relation(fields: [ordenId], references: [id], onDelete: Cascade)

  tipoId String
  tipo   TipoAseguramiento @relation(fields: [tipoId], references: [id], onDelete: Restrict)

  @@map("aseguramientos")
}

model TipoAseguramiento {
  id          String   @id @default(cuid())
  nombre      String   @unique
  icono       String?
  descripcion String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  aseguramientos Aseguramiento[]

  @@map("tipos_aseguramiento")
}

// ==========================================
// NOTIFICACIONES
// ==========================================

model Notificacion {
  id          String      @id @default(cuid())
  titulo      String
  descripcion String
  accion      String?
  leida       Boolean     @default(false)
  estadoEnvio EstadoEnvio @default(PENDIENTE)

  destinatarioId String
  destinatario   Usuario @relation("NotificacionDestinatario", fields: [destinatarioId], references: [id], onDelete: Cascade)

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("notificaciones")
}

// ==========================================
// TRAZABILIDAD (AUDITORÍA)
// ==========================================

model TrazaGeneral {
  id          String   @id @default(cuid())
  actorId     String?
  actor       Usuario? @relation(fields: [actorId], references: [id], onDelete: SetNull)
  rol         String
  accion      String
  entidad     String
  entidadId   String
  descripcion String?
  createdAt   DateTime @default(now())

  @@map("trazas_generales")
}

model TrazaReserva {
  id        String  @id @default(cuid())
  reservaId String
  reserva   Reserva @relation(fields: [reservaId], references: [id], onDelete: Cascade)

  actorId   String?
  actor     Usuario? @relation(fields: [actorId], references: [id], onDelete: SetNull)

  accion    String
  notas     String?
  createdAt DateTime @default(now())

  @@map("trazas_reservas")
}

model TrazaOrdenAseguramiento {
  id        String  @id @default(cuid())
  ordenId   String
  orden     OrdenAseguramiento @relation(fields: [ordenId], references: [id], onDelete: Cascade)

  actorId   String?
  actor     Usuario? @relation(fields: [actorId], references: [id], onDelete: SetNull)

  accion    String
  notas     String?
  createdAt DateTime @default(now())

  @@map("trazas_ordenes_aseguramiento")
}
