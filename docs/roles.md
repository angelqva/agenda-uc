# Sistema de Roles - Agenda UC

## Introducción

El sistema implementa un esquema híbrido de roles que combina roles base asignados explícitamente con roles calculados dinámicamente según la estructura organizacional.

## Roles Base (Asignados)

Los roles base se asignan explícitamente a través de la tabla `UsuarioRol`:

- **RECTOR**: Máxima autoridad del sistema
- **DIRECTIVO_INSTITUCIONAL**: Privilegios administrativos globales  
- **ADMINISTRADOR**: Gestión de maestros del sistema
- **LOGISTICO**: Emisión de aseguramientos

## Roles Calculados (Dinámicos)

Se calculan automáticamente según la posición del usuario en la estructura organizacional:

- **DIRECTIVO**: Usuario en `Area.directivos[]`
- **ALMACENERO**: Usuario en `Area.almaceneros[]`
- **RESPONSABLE_LOCAL**: Usuario en `Local.responsables[]`
- **RESPONSABLE_MEDIO**: Usuario en `Medio.responsables[]`

## Rol Universal

- **USUARIO**: Asignado automáticamente a todos los usuarios autenticados

## Implementación

### Servicio de Roles

El [`UsuarioService`](../framework/services/domain/usuarioService.ts) proporciona métodos para:

- `getEffectiveRoles()`: Obtener todos los roles efectivos
- `hasRole()`: Verificar rol específico
- `hasBaseRole()`: Verificar solo roles base
- `assignRole()`: Asignar rol base
- `removeRole()`: Remover rol base

### Cálculo de Roles Efectivos

```typescript
// Ejemplo de uso
const rolesResult = await UsuarioService.getEffectiveRoles({ 
  email: "usuario@uc.cl" 
});

// Resultado:
// {
//   email: "usuario@uc.cl",
//   rolesBase: ["ADMINISTRADOR"],
//   rolesCalculados: ["DIRECTIVO", "RESPONSABLE_LOCAL"], 
//   rolesEfectivos: ["USUARIO", "ADMINISTRADOR", "DIRECTIVO", "RESPONSABLE_LOCAL"],
//   calculadoEn: Date
// }
```

## Ventajas del Sistema

1. **Flexibilidad**: Roles se actualizan automáticamente
2. **Consistencia**: Un solo punto de verdad para permisos
3. **Trazabilidad**: Registro completo de cambios
4. **Escalabilidad**: Fácil agregar nuevos roles calculados