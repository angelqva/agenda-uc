# Componentes de Ejemplo

Esta carpeta contiene componentes de demostración que muestran cómo utilizar las configuraciones y tipos del sistema.

## Componentes Disponibles

### `RolesList`
Muestra una lista visual de todos los roles del sistema con sus íconos correspondientes.

**Props:** Ninguna
**Tipos utilizados:** `RolSistema`, `IconKey`

### `TiposActividadesList` 
Muestra una lista visual de todos los tipos de actividades configurados en el sistema.

**Props:** Ninguna
**Tipos utilizados:** `ActividadConfig`, `IconKey`

### `TiposAseguramientoList`
Muestra una lista visual de todos los tipos de aseguramientos con descripciones.

**Props:** Ninguna  
**Tipos utilizados:** `AseguramientoConfig`, `IconKey`

## Uso

```tsx
import { RolesList, TiposActividadesList, TiposAseguramientoList } from "@/components/examples";

// En tu componente
<RolesList />
<TiposActividadesList />
<TiposAseguramientoList />
```

## Estructura

Cada componente está refactorizado siguiendo estas mejores prácticas:

- **Tipos tipados**: Uso de interfaces TypeScript específicas
- **Componentes granulares**: Separación de lógica en sub-componentes
- **Imports optimizados**: Uso de barrel exports
- **Props explícitas**: Interfaz clara para cada componente

## Configuración

Los datos mostrados provienen de:
- `@/config/rolesMap` - Configuración de roles
- `@/config/tiposActividades` - Configuración de actividades  
- `@/config/tiposAseguramientos` - Configuración de aseguramientos
- `@/config/iconsMap` - Mapeo de íconos