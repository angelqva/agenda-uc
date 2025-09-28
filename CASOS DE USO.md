Casos de uso a desarrollar (agrupados)
A) Autenticación y sesiones

UC-A1. Iniciar sesión (LDAP)

Actor: Usuario

Pre: Credenciales válidas en LDAP.

Flujo: Autenticar → calcular roles (por defecto, base, calculados) → crear sesión → traza.

Alternos: LDAP caído/credenciales inválidas → error y traza.

UC-A2. Cerrar sesión

Actor: Usuario

Flujo: Invalidar sesión → traza.

UC-A3. Consultar roles efectivos

Actor: Usuario / Admin

Flujo: Devolver lista: USUARIO + base de UsuarioRol + calculados de Area/Local/Medio.

B) Roles y permisos

UC-R1. Asignar rol base a correo

Actor: Administrador

Pre: Correo válido.

Flujo: Crear UsuarioRol (p.ej. LOGISTICO) → notificación opcional → traza.

Alternos: Rol ya asignado → aviso.

UC-R2. Revocar rol base

Actor: Administrador

Flujo: Eliminar UsuarioRol → traza.

UC-R3. Ver historial de cambios de roles

Actor: Admin/Directivo institucional

Flujo: Consultar TrazaGeneral filtrando acciones de roles.

C) Maestros y configuración (gestiones del sistema)

UC-M1. Gestionar sedes

Actor: Admin

CRUD de Sede. Trazas.

UC-M2. Gestionar áreas y su relación con sedes

Actor: Admin

CRUD de Area y vínculos SedeArea (N:M). Setear directivos y almaceneros (arrays de correos). Trazas.

UC-M3. Gestionar locales

Actor: Admin

CRUD Local, asignar responsables, vincular a Area y Sede. Trazas.

UC-M4. Gestionar medios

Actor: Admin

CRUD Medio, asignar responsables, vincular a Local. Trazas.

UC-M5. Gestionar tipos de actividad

Actor: Admin

CRUD TipoActividad (nombre, icono). Trazas.

UC-M6. Gestionar plantillas de actividad

Actor: Usuario/Directivo/Admin (según política)

CRUD Actividad (nombre, descripción, tipo). Trazas.

UC-M7. Configurar parámetros del sistema

Actor: Admin

Reglas de colisión/ventanas de reserva, límites por tipo, política de reintentos de correo, SMTP/LDAP. Trazas.

UC-M8. Reprocesar notificaciones fallidas

Actor: Admin

Reintenta envíos con estadoEnvio = FALLIDO. Trazas.

D) Calendario y eventos

UC-E1. Crear evento personal

Actor: Usuario

Flujo: CRUD Evento. Trazas.

UC-E2. Crear recordatorio de otro evento

Actor: Usuario

Flujo: Crear Evento con eventoReferenciaId al evento objetivo. Trazas.

UC-E3. Promover evento a reserva

Actor: Solicitante

Flujo: Crear Reserva asociada al Evento. Notificar responsables. Trazas.

E) Reservas

UC-RES1. Crear reserva

Actor: Solicitante

Flujo: Datos + estado CREADO + notificación a responsables. Trazas.

UC-RES2. Aprobar/cancelar reserva

Actor: Responsable de local/medio

Flujo: Cambiar estado a APROBADO/CANCELADO. Notificar. Trazas.

UC-RES3. Consultar reservas

Actor: Usuario/Responsable/Directivo/Admin

Filtros: usuario, local, medio, área, sede, estado, rango fechas.

F) Órdenes de aseguramiento

UC-OA1. Crear orden (con selección de revisor)

Actor: Solicitante

Flujo: Elegir revisor (directivo/almacenero). Validar auto-revisión (si coincide correo y tiene rol) → pasar a REVISADA; si no, CREADO. Trazas.

UC-OA2. Revisar orden

Actor: Directivo/Almacenero (designado)

Flujo: Ajustar, notas, marcar REVISADA o cancelar. Notificar. Trazas.

UC-OA3. Aprobar/cancelar orden

Actor: Logístico

Flujo: APROBADO/CANCELADO. Notificar. Trazas.

G) Notificaciones

UC-N1. Enviar/reenviar notificación

Actor: Sistema/Admin

Flujo: Crear Notificacion (PENDIENTE) → enviar → ENVIADO o FALLIDO. Reintentos. Trazas.

UC-N2. Marcar como leída

Actor: Destinatario

Flujo: leida = true. Trazas.

H) Trazabilidad (auditoría)

UC-T1. Consultar trazas de reserva

Actor: Directivo/Admin

Flujo: TrazaReserva por id, periodo, actor.

UC-T2. Consultar trazas de órdenes

Actor: Directivo/Logístico/Admin

Flujo: TrazaOrdenAseguramiento.

UC-T3. Consultar traza general

Actor: Admin/Directivo institucional

Flujo: TrazaGeneral por entidad, acción, actor, fechas.

I) Reportes

UC-REP1. Reporte uso de locales/medios
UC-REP2. Consumo de aseguramientos por tipo/área/sede
UC-REP3. Eficiencia (tiempos) reservas/órdenes
UC-REP4. Comparativas por periodos/sedes/áreas


📌 Actores del sistema

Usuario común → Crea eventos personales, puede solicitar reservas y aseguramientos.

Responsable de local/medio → Aprueba o rechaza reservas sobre recursos bajo su gestión.

Directivo/Almacenero → Revisa órdenes de aseguramiento, aprueba solicitudes de eventos públicos.

Logístico → Emite aseguramientos aprobados.

Administrador → Gestiona usuarios, roles, áreas, locales, medios, actividades y tipos de aseguramiento.

Rector → Actor con privilegios de directivo institucional, supervisa todo.

📌 Casos de uso principales
1. Gestión de usuarios y roles

Administrador crea y gestiona usuarios (desde LDAP o manual).

Administrador asigna roles base (ADMINISTRADOR, LOGÍSTICO, RECTOR, DIRECTIVO_INSTITUCIONAL).

Los roles calculados se derivan de pertenencia a áreas/locales/medios.

Flujo narrado:

Administrador accede a gestión de usuarios.

Crea usuario o importa de LDAP.

Asigna rol base (si corresponde).

El sistema calcula roles adicionales (ej: Responsable de Local A).

2. Creación de eventos personales

Usuario común crea evento personal con fechas y actividad opcional.

No necesita aprobación si no usa recursos.

Flujo narrado:

Usuario abre calendario personal.

Ingresa fecha/hora y (opcional) actividad.

Evento queda en calendario personal, sin flujos de aprobación.

3. Solicitud de reserva (evento con local/medio)

Usuario común crea evento y lo asocia a un local o medio.

Genera automáticamente una Reserva con estado CREADO.

Responsable de local/medio revisa.

Flujo narrado:

Usuario crea evento en un local/medio.

Sistema genera Reserva.estado = CREADO.

Responsable recibe notificación.

Responsable revisa:

✅ Aprueba → Reserva.estado = APROBADO, el evento aparece en calendario del recurso.

❌ Rechaza → Reserva.estado = CANCELADO, el evento no se publica.

4. Solicitud de evento público (universitario)

Usuario común o directivo crea evento.

Envía SolicitudEventoPublico.

Directivo/rector revisa.

Flujo narrado:

Usuario/directivo crea evento.

Solicita hacerlo público → SolicitudEventoPublico.estado = PENDIENTE.

Directivo/rector revisa:

✅ Aprueba → SolicitudEventoPublico.estado = APROBADA, evento visible en calendario universitario.

❌ Rechaza → evento sigue siendo privado.

5. Órdenes de aseguramiento

Usuario común solicita aseguramientos para un evento.

Directivo/almacenero revisa.

Logístico emite.

Flujo narrado:

Usuario crea orden de aseguramiento → EstadoOrden = CREADO.

Directivo recibe notificación:

✅ Si revisa/aprueba → EstadoOrden = REVISADA.

❌ Si rechaza → EstadoOrden = CANCELADO.

Logístico recibe las revisadas y:

✅ Si aprueba → EstadoOrden = APROBADO.

❌ Si rechaza → EstadoOrden = CANCELADO.

⚠️ Nota: Si la orden está ligada a un evento con Reserva.estado != APROBADO, queda en espera hasta que la reserva se apruebe.

6. Notificaciones

Se generan para cada acción: creación, revisión, aprobación, cancelación.

Guardan estado de envío (PENDIENTE, ENVIADO, FALLIDO, REENVIADO).

7. Auditoría (Trazas)

Se guarda un registro (TrazaGeneral, TrazaReserva, TrazaOrdenAseguramiento) cada vez que ocurre una acción importante.