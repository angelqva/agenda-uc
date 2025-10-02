Aplicación Next.js (App Router) con soporte de autenticación y búsqueda de usuarios vía LDAP (Samba AD).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Configuración de entorno (LDAP)

1) Levanta los servicios con Docker (incluye Samba AD):

```bash
docker compose up -d
```

2) Copia variables de entorno para desarrollo:

```bash
cp .env.example .env.local
```

3) Credenciales y conexión (ver también `docs/ldap.md`):

- LDAP_URL=ldap://localhost:389
- LDAP_BASE_DN=DC=reduc,DC=edu,DC=cu
- LDAP_BIND_DN=ldap.search@reduc.edu.cu
- LDAP_BIND_PASSWORD=1234asdf*
- LDAP_USER_FILTER=(objectClass=user)
- LDAP_USER_ATTRIBUTES=cn,displayName,mail,sAMAccountName,department,telephoneNumber

Usuarios de ejemplo (password por defecto 1234asdf*): consultar `samba/usuarios.txt` y script `samba/crear_usuarios_docker.sh`.

Nota de mapeo requerido: displayName -> nombre, mail -> correo.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
