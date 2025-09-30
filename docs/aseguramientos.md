# Sistema de Aseguramientos - Agenda UC

## Introducción

El sistema de aseguramientos permite solicitar y gestionar recursos logísticos para eventos.

## Flujo de Órdenes

### Creación
- Usuario solicita aseguramiento
- Sistema crea OrdenAseguramiento
- Estado inicial: CREADO o REVISADA (si auto-revisión válida)

### Revisión
- Directivo/Almacenero revisa orden
- Puede ajustar cantidades y agregar notas
- Cambia estado a REVISADA o CANCELADO

### Aprobación
- Logístico aprueba orden revisada
- Cambia estado a APROBADO o CANCELADO
- Solo órdenes con reserva APROBADA pueden ejecutarse

### Emisión
- Logístico emite aseguramiento aprobado
- Sistema registra entrega
- Estado final: EMITIDO

## Estados de Orden

- **CREADO**: Orden inicial pendiente de revisión
- **REVISADA**: Orden revisada por responsable
- **APROBADO**: Orden aprobada por logístico
- **CANCELADO**: Orden cancelada en cualquier etapa
- **EMITIDO**: Aseguramiento entregado

## Auto-revisión

Si el solicitante tiene rol de Directivo/Almacenero en el área correspondiente, la orden se marca automáticamente como REVISADA.

## Dependencias

- Orden requiere reserva asociada
- Reserva debe estar APROBADA para ejecutar orden
- Solo usuarios con permisos pueden revisar/aprobar

## Tipos de Aseguramiento

*Por definir según necesidades específicas*

## Trazabilidad

Todas las operaciones se registran en:
- `TrazaOrdenAseguramiento`: Cambios específicos de órdenes
- `TrazaGeneral`: Registro general del sistema