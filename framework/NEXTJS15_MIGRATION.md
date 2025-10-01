# Migración a Next.js 15 - Cambios en APIs

## Cambio en Dynamic APIs

En Next.js 15, los parámetros dinámicos (`params`) en las rutas API se han convertido en **Promises** y deben ser esperados con `await` antes de usarlos.

### ❌ Antes (Next.js 14)
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const email = params.email; // ✗ Error en Next.js 15
}
```

### ✅ Después (Next.js 15)
```typescript
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ email: string }> }
) {
  const { email } = await params; // ✓ Correcto
}
```

## Archivos Actualizados

- ✅ `/app/api/usuarios/roles/[email]/route.ts` - Corregido para usar `await params`

## Archivos que NO requieren cambios

- ✅ `/app/api/usuarios/verify-role/route.ts` - No usa params dinámicos
- ✅ `/app/api/auth/logout/route.ts` - No usa params dinámicos
- ✅ `/app/api/auth/[...nextauth]/route.ts` - Manejado por NextAuth

## Referencias

- [Next.js 15 - Dynamic APIs](https://nextjs.org/docs/messages/sync-dynamic-apis)
- [Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)

## Tip de Desarrollo

Para evitar este error en el futuro, siempre usar `await params` cuando trabajemos con rutas dinámicas en Next.js 15+.