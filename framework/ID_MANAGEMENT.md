# Gestión de IDs - CUID2

## Migración a @paralleldrive/cuid2

Se ha migrado de `cuid` a `@paralleldrive/cuid2` para mejor seguridad y performance.

## ⚠️ Importante

**Prisma Schema**: Se mantiene usando `cuid()` ya que Prisma no soporta nativamente `cuid2()`.
**Código JavaScript/TypeScript**: Se usa `@paralleldrive/cuid2` a través de utilidades.

## 🔧 Utilidades Disponibles

### Generar IDs

```typescript
import { generateId, generateShortId } from '@/lib/utils';

// ID completo (recomendado para entidades principales)
const userId = generateId(); // ej: "clx1x2y3z4a5b6c7d8e9f0"

// ID corto (útil para códigos o referencias)
const shortCode = generateShortId(); // ej: "clx1x2y3z4"
```

### Validar IDs

```typescript
import { isValidCuid2 } from '@/lib/utils';

const isValid = isValidCuid2("clx1x2y3z4a5b6c7d8e9f0"); // true
const isInvalid = isValidCuid2("123invalid"); // false
```

### Uso Directo

```typescript
import { createId } from '@/lib/utils';

const id = createId(); // Función nativa de @paralleldrive/cuid2
```

## 📋 Casos de Uso

### En Servicios de Dominio

```typescript
import { generateId } from '@/lib/utils';

export class MiServicio {
  static async crearRecurso(data: CreateData) {
    // Generar ID para uso interno (no base de datos)
    const transactionId = generateId();
    
    // El ID de base de datos lo genera Prisma automáticamente
    const recurso = await prisma.recurso.create({ 
      data: { ...data } // Prisma genera el ID con cuid()
    });
    
    return { recurso, transactionId };
  }
}
```

### Para Códigos de Referencia

```typescript
import { generateShortId } from '@/lib/utils';

// Código de reserva
const codigoReserva = `RES-${generateShortId()}`;

// Código de orden
const codigoOrden = `ORD-${generateShortId()}`;
```

### Para Tracking y Logs

```typescript
import { generateId } from '@/lib/utils';

console.log(`[${generateId()}] Operación iniciada`, { data });
```

## 🔄 Migración de Código Existente

### Antes (con cuid)
```typescript
import cuid from 'cuid';

const id = cuid(); // ❌ Versión antigua
```

### Después (con @paralleldrive/cuid2)
```typescript
import { generateId } from '@/lib/utils';

const id = generateId(); // ✅ Nueva versión
```

## 🛡️ Ventajas de CUID2

1. **Mejor seguridad**: Más entropia y resistente a ataques
2. **Performance mejorado**: Generación más rápida
3. **Tamaño configurable**: Soporte para IDs más cortos
4. **Mejor distribución**: Menor probabilidad de colisiones
5. **Mantenimiento activo**: Librería más actualizada

## 🎯 Recomendaciones

- **Para IDs de base de datos**: Dejar que Prisma use `cuid()` automáticamente
- **Para IDs de aplicación**: Usar `generateId()` de nuestras utilidades
- **Para códigos cortos**: Usar `generateShortId()`
- **Para validación**: Usar `isValidCuid2()` cuando sea necesario

## 🔗 Referencias

- [CUID2 Documentation](https://github.com/paralleldrive/cuid2)
- [Prisma ID Generation](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#id)
- [ID Best Practices](https://cuid2.org/)