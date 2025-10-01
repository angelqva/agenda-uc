
# Configuración LDAP - Samba DC

## 🎯 Acceso Rápido

**Servidor**: `localhost:389`  
**Usuario**: `ldap.search@reduc.edu.cu`  
**Contraseña**: `1234asdf*`  
**Base DN**: `DC=reduc,DC=edu,DC=cu`

## � Comandos Básicos

### Buscar todos los usuarios
```bash
ldapsearch -x -H ldap://localhost:389 -D 'ldap.search@reduc.edu.cu' -w '1234asdf*' -b 'DC=reduc,DC=edu,DC=cu' '(objectClass=user)' cn sAMAccountName
```

### Buscar un usuario específico
```bash
ldapsearch -x -H ldap://localhost:389 -D 'ldap.search@reduc.edu.cu' -w '1234asdf*' -b 'DC=reduc,DC=edu,DC=cu' '(sAMAccountName=angel.napoles)'
```

### Buscar grupos
```bash
ldapsearch -x -H ldap://localhost:389 -D 'ldap.search@reduc.edu.cu' -w '1234asdf*' -b 'DC=reduc,DC=edu,DC=cu' '(objectClass=group)' cn
```

## ⚙️ Configuración para Apps

### Node.js / JavaScript
```javascript
const ldapConfig = {
  url: 'ldap://localhost:389',
  baseDN: 'DC=reduc,DC=edu,DC=cu',
  bindDN: 'ldap.search@reduc.edu.cu',
  bindCredentials: '1234asdf*'
};
```

### PHP / Laravel
```php
'ldap' => [
    'host' => 'localhost',
    'port' => 389,
    'base_dn' => 'DC=reduc,DC=edu,DC=cu',
    'username' => 'ldap.search@reduc.edu.cu',
    'password' => '1234asdf*',
],
```

## 🛠️ Gestión

### Crear nuevos usuarios
```bash
docker exec samba_ad_dev samba-tool user create nombre.usuario "contraseña123"
```

### Reiniciar servicio
```bash
docker-compose restart samba-ad
```

### Ver logs
```bash
docker logs samba_ad_dev
```

## ⚠️ Importante

- ✅ **Desarrollo**: Configuración válida
- ❌ **Producción**: Cambiar contraseñas y usar SSL