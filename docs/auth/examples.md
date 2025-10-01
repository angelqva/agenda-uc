# Ejemplos de Uso - Autenticación LDAP

## Testing con curl

### 1. Login LDAP
```bash
curl -X POST http://localhost:4000/auth/ldap/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "test.user",
    "password": "password123"
  }' \
  -c cookies.txt
```

### 2. Obtener perfil (usando cookie)
```bash
curl -X GET http://localhost:4000/auth/ldap/profile \
  -b cookies.txt
```

### 3. Verificar autenticación
```bash
curl -X GET http://localhost:4000/auth/ldap/check \
  -b cookies.txt
```

### 4. Logout
```bash
curl -X POST http://localhost:4000/auth/ldap/logout \
  -b cookies.txt \
  -c cookies.txt
```

## Testing con Postman

### Configuración de Environment
```json
{
  "base_url": "http://localhost:4000",
  "username": "test.user",
  "password": "password123"
}
```

### Pre-request Script para Login
```javascript
// Configurar cookies automáticamente
pm.request.headers.add({
  key: 'Content-Type',
  value: 'application/json'
});
```

### Test Script para Login
```javascript
// Verificar respuesta exitosa
pm.test("Login successful", function () {
    pm.response.to.have.status(200);
    
    const responseJson = pm.response.json();
    pm.expect(responseJson.success).to.be.true;
    pm.expect(responseJson.user).to.have.property('id');
    pm.expect(responseJson.user).to.have.property('email');
    pm.expect(responseJson.user).to.have.property('roles');
});

// Las cookies se manejan automáticamente
pm.test("Cookie set", function () {
    pm.expect(pm.cookies.has('auth_token')).to.be.true;
});
```

## Testing Programático (JavaScript/TypeScript)

### Cliente con fetch
```typescript
class AuthClient {
  private baseUrl = 'http://localhost:4000';
  private cookies: string[] = [];

  async login(username: string, password: string) {
    const response = await fetch(`${this.baseUrl}/auth/ldap/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include', // Importante para cookies
    });

    if (response.ok) {
      // Las cookies se manejan automáticamente
      return await response.json();
    }
    
    throw new Error(`Login failed: ${response.statusText}`);
  }

  async getProfile() {
    const response = await fetch(`${this.baseUrl}/auth/ldap/profile`, {
      credentials: 'include',
    });

    if (response.ok) {
      return await response.json();
    }
    
    throw new Error(`Get profile failed: ${response.statusText}`);
  }

  async logout() {
    const response = await fetch(`${this.baseUrl}/auth/ldap/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      return await response.json();
    }
    
    throw new Error(`Logout failed: ${response.statusText}`);
  }
}

// Uso
const client = new AuthClient();

try {
  // Login
  const loginResult = await client.login('test.user', 'password123');
  console.log('Login exitoso:', loginResult);

  // Obtener perfil
  const profile = await client.getProfile();
  console.log('Perfil del usuario:', profile);

  // Logout
  const logoutResult = await client.logout();
  console.log('Logout exitoso:', logoutResult);

} catch (error) {
  console.error('Error:', error.message);
}
```

## Testing con Jest/Supertest

```typescript
import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/ldap/login (POST)', () => {
    it('should login successfully with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/ldap/login')
        .send({
          username: 'valid.user',
          password: 'validpassword',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.user).toBeDefined();
          expect(res.headers['set-cookie']).toBeDefined();
        });
    });

    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/ldap/login')
        .send({
          username: 'invalid.user',
          password: 'wrongpassword',
        })
        .expect(401)
        .expect((res) => {
          expect(res.body.success).toBe(false);
        });
    });

    it('should fail with missing fields', () => {
      return request(app.getHttpServer())
        .post('/auth/ldap/login')
        .send({
          username: 'test',
          // missing password
        })
        .expect(400);
    });
  });

  describe('Protected routes', () => {
    let authCookie: string;

    beforeAll(async () => {
      // Login to get auth cookie
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/ldap/login')
        .send({
          username: 'valid.user',
          password: 'validpassword',
        });
      
      authCookie = loginResponse.headers['set-cookie'][0];
    });

    it('/auth/ldap/profile (GET) should return user profile', () => {
      return request(app.getHttpServer())
        .get('/auth/ldap/profile')
        .set('Cookie', authCookie)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.email).toBeDefined();
          expect(res.body.roles).toBeDefined();
        });
    });

    it('/auth/ldap/check (GET) should verify authentication', () => {
      return request(app.getHttpServer())
        .get('/auth/ldap/check')
        .set('Cookie', authCookie)
        .expect(200)
        .expect((res) => {
          expect(res.body.authenticated).toBe(true);
          expect(res.body.user).toBeDefined();
        });
    });

    it('/auth/ldap/logout (POST) should logout successfully', () => {
      return request(app.getHttpServer())
        .post('/auth/ldap/logout')
        .set('Cookie', authCookie)
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          // Verify cookie is cleared
          expect(res.headers['set-cookie']).toBeDefined();
        });
    });
  });

  describe('Unauthorized access', () => {
    it('should reject access without auth cookie', () => {
      return request(app.getHttpServer())
        .get('/auth/ldap/profile')
        .expect(401);
    });

    it('should reject access with invalid cookie', () => {
      return request(app.getHttpServer())
        .get('/auth/ldap/profile')
        .set('Cookie', 'auth_token=invalid_token')
        .expect(401);
    });
  });
});
```

## Scripts útiles

### Setup de desarrollo
```bash
#!/bin/bash
# setup-dev.sh

echo "🚀 Configurando entorno de desarrollo..."

# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env

# Generar cliente Prisma
npx prisma generate

# Crear base de datos (si no existe)
npx prisma db push

echo "✅ Entorno listo. Ejecuta 'npm run start:dev' para iniciar."
```

### Testing completo
```bash
#!/bin/bash
# test-auth.sh

echo "🧪 Ejecutando tests de autenticación..."

# Tests unitarios
echo "📋 Tests unitarios..."
npm test auth.service.spec.ts

# Tests e2e
echo "🌐 Tests end-to-end..."
npm run test:e2e

# Linting
echo "🔍 Verificando código..."
npm run lint

echo "✅ Tests completados."
```

### Monitoring
```bash
#!/bin/bash
# monitor-auth.sh

echo "📊 Monitoreando logs de autenticación..."

# Logs de aplicación
tail -f logs/application.log | grep -E "(LOGIN|LOGOUT|AUTH)"

# Logs de base de datos (si aplicable)
# tail -f logs/database.log | grep -E "(usuario|traza)"
```

## Comandos de diagnóstico

### Verificar configuración LDAP
```bash
# Test de conexión LDAP
ldapsearch -H ldap://localhost:389 -D "cn=ldap.search,ou=usuarios,dc=reduc,dc=edu,dc=cu" -w ldap123 -b "ou=usuarios,dc=reduc,dc=edu,dc=cu" "(uid=test.user)"
```

### Verificar JWT
```javascript
// Decodificar JWT (sin verificar firma)
const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
const payload = JSON.parse(atob(jwt.split('.')[1]));
console.log(payload);
```

### Verificar base de datos
```sql
-- Verificar usuarios
SELECT u.email, u.name, ur.rol 
FROM usuarios u 
LEFT JOIN usuario_roles ur ON u.id = ur.usuarioId;

-- Verificar trazas recientes
SELECT * FROM trazas_generales 
WHERE accion LIKE '%LDAP%' 
ORDER BY createdAt DESC 
LIMIT 10;
```