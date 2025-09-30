# Sistema de Calendario - Agenda UC

## Introducción

El sistema maneja múltiples tipos de calendarios según el contexto y permisos del usuario.

## Tipos de Calendario

### Personal
- Eventos creados por el usuario
- Visibles solo para el propietario
- No requieren aprobación

### Locales
- Eventos asociados a locales específicos
- Requieren reserva aprobada
- Visibles según permisos de área/sede

### Medios
- Eventos asociados a medios específicos  
- Requieren reserva aprobada
- Visibles según permisos de área/local

### Universitario
- Eventos públicos aprobados
- Visibles para toda la universidad
- Requieren aprobación de Directivo/Rector

## Flujos de Eventos

### Evento Personal
```
Usuario crea evento → Sistema lo guarda → Visible en calendario personal
```

### Reserva de Recurso
```
Usuario crea evento con local/medio
→ Sistema genera Reserva (CREADO)
→ Responsable revisa
  → Aprueba → APROBADO → Visible en calendario del recurso
  → Rechaza → CANCELADO → No visible
```

### Evento Público
```
Usuario solicita evento público
→ SolicitudEventoPublico (PENDIENTE)
→ Directivo/Rector revisa
  → Aprueba → APROBADA → Visible en calendario universitario
  → Rechaza → RECHAZADA → Solo visible personalmente
```

## Estados de Reserva

- **CREADO**: Reserva inicial pendiente de revisión
- **APROBADO**: Reserva aprobada, evento visible
- **CANCELADO**: Reserva rechazada, evento no visible

## Estados de Solicitud Pública

- **PENDIENTE**: Esperando revisión
- **APROBADA**: Evento público aprobado
- **RECHAZADA**: Solicitud rechazada

## Implementación

*Detalles técnicos a desarrollar*