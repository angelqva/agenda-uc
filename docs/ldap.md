
# Configuración LDAP - Samba DC

## 🎯 Acceso Rápido

**Servidor**: `localhost:389`  
**Usuario**: `ldap.search@reduc.edu.cu`  
**Contraseña**: `1234asdf*`  
**Base DN**: `DC=reduc,DC=edu,DC=cu`

### Crear nuevos usuarios
```bash
# Método automático (recomendado)
docker-compose up -d
chmod +x ./samba/crear_usuarios_docker.sh
./samba/crear_usuarios_docker.sh
```

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