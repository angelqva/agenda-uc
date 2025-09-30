# 📁 Estructura de DTOs y Schemas

Esta carpeta contiene la implementación de DTOs (Data Transfer Objects) y Schemas de validación para toda la aplicación, siguiendo las mejores prácticas de separación de responsabilidades.

## 🏗️ Arquitectura

```
framework/
├── dtos/           # Data Transfer Objects
│   ├── common.ts   # DTOs comunes reutilizables
│   ├── usuario.ts  # DTOs del dominio Usuario
│   └── index.ts    # Barrel exports
├── schemas/        # Esquemas de validación con Zod
│   ├── common.ts   # Schemas comunes reutilizables
│   ├── usuario.ts  # Schemas del dominio Usuario
│   ├── organizacion.ts # Schemas de Área, Sede, Local, Medio
│   └── index.ts    # Barrel exports
└── services/       # Servicios que utilizan DTOs y Schemas
    └── domain/
        └── usuarioService.ts # Refactorizado con DTOs/Schemas
```

## 🎯 Conceptos Clave

### DTOs (Data Transfer Objects)
- **Propósito**: Definir la estructura de datos para transferencia entre capas
- **Generación**: Se crean automáticamente desde schemas usando `z.infer<typeof schema>`
- **Beneficios**: Type safety, consistencia, reutilización

### Schemas (Esquemas de Validación)
- **Propósito**: Validar y transformar datos de entrada
- **Librería**: Zod para validación runtime con inferencia de tipos
- **Beneficios**: Validación robusta, mensajes de error personalizados, transformaciones

## 📋 Esquemas Comunes Disponibles

### Campos Básicos
```typescript
emailSchema          // Email válido, normalizado
passwordSchema       // Contraseña segura con requisitos
nombreSchema         // Nombres con validación de caracteres
apellidoSchema       // Apellidos con validación
telefonoSchema       // Teléfono en formato internacional
urlSchema           // URLs válidas
codigoSchema        // Códigos alfanuméricos uppercase
```

### Campos Numéricos
```typescript
capacidadSchema      // Capacidad de locales/medios (1-10000)
cantidadSchema       // Cantidades generales (1-1000)
participantesSchema  // Número de participantes (1-1000)
```

### Paginación
```typescript
pageSchema          // Página (mín: 1, default: 1)
limitSchema         // Límite (1-100, default: 10)
paginationSchema    // Combina page + limit
searchPaginationSchema // Paginación + búsqueda
```

### Fechas
```typescript
fechaSchema         // Fecha válida (string ISO o Date)
fechaFuturaSchema   // Fecha que debe ser futura
rangoFechasSchema   // Rango de fechas válido
```

## 🔧 Uso en Servicios

### Antes (sin DTOs/Schemas)
```typescript
// ❌ Sin validación, tipos sueltos
static async create(data: any): Promise<Usuario> {
  // Sin validación de entrada
  return await prisma.usuario.create({ data });
}

static async findByEmail(email: string): Promise<Usuario | null> {
  // Sin validación de email
  return await prisma.usuario.findUnique({ where: { email } });
}
```

### Después (con DTOs/Schemas)
```typescript
// ✅ Con validación y tipos seguros
static async create(input: CreateUsuarioDto): Promise<Usuario> {
  const validated = createUsuarioSchema.parse(input);
  return await prisma.usuario.create({ data: validated });
}

static async findByEmail(input: FindUsuarioByEmailDto): Promise<Usuario | null> {
  const validated = findUsuarioByEmailSchema.parse(input);
  return await prisma.usuario.findUnique({ where: { email: validated.email } });
}
```

## 🌐 Uso en APIs

### Antes (validación manual)
```typescript
// ❌ Validación repetitiva y propensa a errores
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  if (!body.email || !body.email.includes('@')) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }
  
  // Más validaciones manuales...
}
```

### Después (con schemas)
```typescript
// ✅ Validación centralizada y reutilizable
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = createUsuarioSchema.parse(body); // ¡Una línea!
    
    const usuario = await UsuarioService.create(input);
    return NextResponse.json({ success: true, data: usuario });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Datos inválidos", details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
```

## 📝 Crear Nuevos Schemas

### 1. Definir Schema
```typescript
// schemas/evento.ts
export const createEventoSchema = z.object({
  titulo: tituloSchema,
  inicio: fechaFuturaSchema,
  fin: fechaFuturaSchema,
  creadorEmail: emailSchema,
  actividadId: idSchema.optional(),
}).refine((data) => new Date(data.inicio) < new Date(data.fin), {
  message: "La fecha de inicio debe ser anterior a la de fin",
  path: ["fin"],
});
```

### 2. Generar DTO
```typescript
// dtos/evento.ts
export type CreateEventoDto = z.infer<typeof createEventoSchema>;
```

### 3. Usar en Servicio
```typescript
// services/domain/eventoService.ts
static async create(input: CreateEventoDto): Promise<Evento> {
  const validated = createEventoSchema.parse(input);
  return await prisma.evento.create({ data: validated });
}
```

## 🔄 Migración de Servicios Existentes

Para migrar un servicio existente:

1. **Identificar entradas**: ¿Qué parámetros recibe cada método?
2. **Crear schemas**: Definir validación para cada entrada
3. **Generar DTOs**: Usar `z.infer<typeof schema>`
4. **Refactorizar métodos**: Cambiar parámetros por DTOs
5. **Actualizar APIs**: Usar schemas para validación

## 🎯 Beneficios Logrados

- ✅ **Type Safety**: Tipos automáticos desde schemas
- ✅ **Validación Centralizada**: Un lugar para todas las reglas
- ✅ **Reutilización**: Schemas comunes para casos frecuentes  
- ✅ **Consistencia**: Mismas reglas en APIs y servicios
- ✅ **Mantenibilidad**: Cambios centralizados en schemas
- ✅ **Developer Experience**: Mejor IntelliSense y detección de errores

## 📚 Próximos Pasos

1. **Migrar servicios restantes** al patrón DTO/Schema
2. **Crear schemas para dominios faltantes** (Evento, Reserva, etc.)
3. **Implementar transformaciones** avanzadas en schemas
4. **Agregar validaciones condicionales** según contexto
5. **Documentar patrones específicos** por dominio