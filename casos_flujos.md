# 📌 Casos de Uso y Flujos del Sistema de Gestión de Reservas y Aseguramientos

Este documento consolida los **modelos**, **casos de uso** y **flujos narrados** en un único recurso para guiar a los desarrolladores en la implementación del sistema.

---

## 🎭 Actores del sistema

- **Usuario común** → Crea eventos personales, puede solicitar reservas y aseguramientos.
- **Responsable de local/medio** → Aprueba o rechaza reservas sobre recursos bajo su gestión.
- **Directivo/Almacenero** → Revisa órdenes de aseguramiento, aprueba solicitudes de eventos públicos.
- **Logístico** → Emite aseguramientos aprobados.
- **Administrador** → Gestiona usuarios, roles, áreas, locales, medios, actividades y tipos de aseguramiento.
- **Rector** → Actor con privilegios de directivo institucional, supervisa todo.

---

## 🔑 A) Autenticación y sesiones

### UC-A1. Iniciar sesión (LDAP)
- **Actor**: Usuario
- **Flujo**: Autenticar en LDAP → calcular roles (base y calculados) → crear sesión → registrar traza.

### UC-A2. Cerrar sesión
- **Actor**: Usuario
- **Flujo**: Invalidar sesión → registrar traza.

### UC-A3. Consultar roles efectivos
- **Actor**: Usuario / Admin
- **Flujo**: Devolver lista: USUARIO + roles base de `UsuarioRol` + roles calculados de `Área/Local/Medio`.

---

## 🛡️ B) Roles y permisos

### UC-R1. Asignar rol base
- **Actor**: Administrador
- **Flujo**: Crear `UsuarioRol` → notificar → registrar traza.

### UC-R2. Revocar rol base
- **Actor**: Administrador
- **Flujo**: Eliminar `UsuarioRol` → registrar traza.

### UC-R3. Ver historial de roles
- **Actor**: Admin/Directivo institucional
- **Flujo**: Consultar `TrazaGeneral` filtrando acciones de roles.

---

## ⚙️ C) Maestros y configuración

- **UC-M1.** Gestionar sedes
- **UC-M2.** Gestionar áreas y relación con sedes
- **UC-M3.** Gestionar locales
- **UC-M4.** Gestionar medios
- **UC-M5.** Gestionar tipos de actividad
- **UC-M6.** Gestionar plantillas de actividad
- **UC-M7.** Configurar parámetros del sistema
- **UC-M8.** Reprocesar notificaciones fallidas

Todos estos son CRUDs con registro de trazas.

---

## 📅 D) Calendario y eventos

### UC-E1. Crear evento personal
- **Actor**: Usuario
- **Flujo**: Crear evento (sin local/medio) → visible en calendario personal.

### UC-E2. Crear recordatorio de otro evento
- **Actor**: Usuario
- **Flujo**: Crear evento con `eventoReferenciaId` al evento objetivo.

### UC-E3. Promover evento a reserva
- **Actor**: Solicitante
- **Flujo**: Crear `Reserva` asociada → notificar responsables.

---

## 🏛️ E) Reservas

### UC-RES1. Crear reserva
- **Actor**: Solicitante
- **Flujo**: Estado inicial `CREADO` → notificar responsables.

### UC-RES2. Aprobar/cancelar reserva
- **Actor**: Responsable local/medio
- **Flujo**: Cambiar estado a `APROBADO` o `CANCELADO` → notificar.

### UC-RES3. Consultar reservas
- **Actor**: Usuario/Responsable/Directivo/Admin
- **Flujo**: Filtrar por usuario, local, medio, área, sede, estado, fechas.

---

## 🎓 F) Solicitudes de eventos públicos

### UC-SEP1. Crear solicitud de evento público
- **Actor**: Solicitante
- **Flujo**: Crear `SolicitudEventoPublico` en estado `PENDIENTE`.

### UC-SEP2. Revisar solicitud pública
- **Actor**: Directivo/Rector
- **Flujo**: Marcar como `APROBADA` o `RECHAZADA`.

---

## 📦 G) Órdenes de aseguramiento

### UC-OA1. Crear orden
- **Actor**: Solicitante
- **Flujo**: Seleccionar revisor → si auto-revisión válida (rol + correo coincide) → `REVISADA`; si no, `CREADO`.

### UC-OA2. Revisar orden
- **Actor**: Directivo/Almacenero
- **Flujo**: Ajustar, notas, marcar `REVISADA` o `CANCELADO`.

### UC-OA3. Aprobar/cancelar orden
- **Actor**: Logístico
- **Flujo**: Cambiar estado a `APROBADO` o `CANCELADO`.

⚠️ Nota: La orden queda en espera hasta que la reserva asociada esté `APROBADA`.

---

## 🔔 H) Notificaciones

### UC-N1. Enviar/reenviar notificación
- **Actor**: Sistema/Admin
- **Flujo**: Crear en estado `PENDIENTE` → intentar envío → marcar `ENVIADO` o `FALLIDO`.

### UC-N2. Marcar como leída
- **Actor**: Usuario destinatario
- **Flujo**: Cambiar `leida = true`.

---

## 📑 I) Trazabilidad

### UC-T1. Consultar trazas de reservas
- **Actor**: Directivo/Admin
- **Flujo**: Filtrar `TrazaReserva` por id, periodo, actor.

### UC-T2. Consultar trazas de órdenes
- **Actor**: Directivo/Logístico/Admin
- **Flujo**: Filtrar `TrazaOrdenAseguramiento`.

### UC-T3. Consultar traza general
- **Actor**: Admin/Directivo institucional
- **Flujo**: Filtrar `TrazaGeneral` por entidad, acción, actor, fechas.

---

## 📊 J) Reportes

- UC-REP1. Uso de locales/medios
- UC-REP2. Consumo de aseguramientos por tipo/área/sede
- UC-REP3. Eficiencia de reservas/órdenes (tiempos)
- UC-REP4. Comparativas por periodos/sedes/áreas

---

# 📌 Flujos narrados

### 1. Evento personal
```
Usuario crea evento → sistema lo guarda en calendario personal
(No intervienen aprobaciones ni aseguramientos)
```

### 2. Reserva de local/medio
```
Usuario crea evento con local/medio
→ Sistema genera Reserva (estado = CREADO)
→ Responsable recibe notificación
  → Si aprueba → estado = APROBADO → evento aparece en calendario del recurso
  → Si rechaza → estado = CANCELADO → evento no se publica
```

### 3. Evento público universitario
```
Usuario/Directivo crea evento
→ Envía SolicitudEventoPublico (estado = PENDIENTE)
→ Directivo/Rector revisa
  → Si aprueba → estado = APROBADA → evento visible en calendario universitario
  → Si rechaza → estado = RECHAZADA → evento sigue privado
```

### 4. Orden de aseguramiento
```
Usuario solicita aseguramiento (estado = CREADO)
→ Directivo revisa
  → Si aprueba → estado = REVISADA
  → Si rechaza → estado = CANCELADO
→ Logístico revisa las REVISADAS
  → Si aprueba → estado = APROBADO → aseguramiento emitido
  → Si rechaza → estado = CANCELADO

Nota: Si la orden está ligada a un evento con Reserva no aprobada, queda en espera.
```

---

# 📌 Derivación de calendarios

- **Personal** → todos los eventos creados por el usuario.
- **Locales** → eventos con `localId` y `Reserva.estado = APROBADO`.
- **Medios** → eventos con `medioId` y `Reserva.estado = APROBADO`.
- **Universitario** → eventos con `SolicitudEventoPublico.estado = APROBADA`.

---

✅ Este documento consolida **modelos**, **casos de uso** y **flujos narrados** para orientar a los desarrolladores en el diseño e implementación del sistema.

