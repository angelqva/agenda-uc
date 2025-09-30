# Modelos de Datos - Agenda UC

## Introducción

Este documento describe los modelos de datos y relaciones del sistema.

## Modelo Usuario

```typescript
type Usuario = {
  id: string;
  email: string;
  nombre: string;
  imageUrl: string | null;
  biografia: string | null;
  telefono: string | null;
  activo: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
```

## Modelo de Roles

### Enums
- `RolBase`: Roles asignados explícitamente
- `RolSistema`: Todos los roles (base + calculados + universal)

## Estructura Organizacional

### Área
- Código único
- Nombre
- Directivos (emails)
- Almaceneros (emails)

### Sede
- Nombre
- Ubicación

### Local
- Código único
- Nombre
- Capacidad
- Responsables (emails)
- Área asociada
- Sede asociada

### Medio
- Código único
- Nombre
- Descripción
- Responsables (emails)
- Local asociado

## Relaciones

*Diagrama y detalles a desarrollar*