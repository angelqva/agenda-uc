# Documentación de API - Agenda UC

## Introducción

Esta documentación describe los endpoints REST disponibles en el sistema.

## Autenticación

Todas las APIs requieren autenticación mediante JWT token obtenido del login.

```
Authorization: Bearer <jwt_token>
```

## Formato de Respuesta

### Respuesta Exitosa
```json
{
  "success": true,
  "data": { /* datos específicos */ },
  "toast": {
    "type": "success",
    "title": "Operación Exitosa",
    "message": "Descripción del resultado"
  }
}
```

### Respuesta con Error
```json
{
  "success": false,
  "fieldErrors": {
    "email": ["Email es requerido"],
    "rol": ["Rol inválido"]
  },
  "rootError": "Error general",
  "toast": {
    "type": "error", 
    "title": "Error",
    "message": "Descripción del error"
  }
}
```

## Endpoints de Usuario

### GET /api/usuarios/roles/[email]
Obtiene los roles efectivos de un usuario.

**Parámetros:**
- `email`: Email del usuario

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "email": "usuario@uc.cl",
    "rolesBase": ["ADMINISTRADOR"],
    "rolesCalculados": ["DIRECTIVO"],
    "rolesEfectivos": ["USUARIO", "ADMINISTRADOR", "DIRECTIVO"],
    "calculadoEn": "2024-01-01T12:00:00Z"
  }
}
```

### POST /api/usuarios/verify-role
Verifica si un usuario tiene un rol específico.

**Body:**
```json
{
  "email": "usuario@uc.cl",
  "rol": "ADMINISTRADOR"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "email": "usuario@uc.cl",
    "rol": "ADMINISTRADOR", 
    "hasRole": true,
    "verificadoEn": "2024-01-01T12:00:00Z"
  }
}
```

## Endpoints de Roles

### POST /api/usuarios/assign-role
Asigna un rol base a un usuario.

### POST /api/usuarios/remove-role  
Remueve un rol base de un usuario.

## Endpoints de Maestros

### Áreas
- `GET /api/areas` - Listar áreas
- `POST /api/areas` - Crear área
- `PUT /api/areas/[id]` - Actualizar área
- `DELETE /api/areas/[id]` - Eliminar área

### Sedes
- `GET /api/sedes` - Listar sedes
- `POST /api/sedes` - Crear sede
- `PUT /api/sedes/[id]` - Actualizar sede
- `DELETE /api/sedes/[id]` - Eliminar sede

### Locales
- `GET /api/locales` - Listar locales
- `POST /api/locales` - Crear local
- `PUT /api/locales/[id]` - Actualizar local
- `DELETE /api/locales/[id]` - Eliminar local

### Medios
- `GET /api/medios` - Listar medios
- `POST /api/medios` - Crear medio
- `PUT /api/medios/[id]` - Actualizar medio
- `DELETE /api/medios/[id]` - Eliminar medio

## Endpoints de Calendario

*Por implementar*

## Endpoints de Reservas

*Por implementar*

## Endpoints de Aseguramientos

*Por implementar*

## Códigos de Estado HTTP

- `200`: Operación exitosa
- `201`: Recurso creado
- `400`: Error de validación o datos incorrectos
- `401`: No autenticado
- `403`: Sin permisos
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

## Rate Limiting

*Por implementar según necesidades*

## Paginación

Los endpoints que retornan listados soportan paginación:

```
GET /api/usuarios?page=1&limit=10
```

**Respuesta:**
```json
{
  "data": [/* elementos */],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```