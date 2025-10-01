#!/bin/bash
# Script para crear usuarios en Samba AD usando docker exec
# Dominio: REDUC.EDU.CU
# Uso: ./crear_usuarios_docker.sh

CONTAINER_NAME="samba_ad_dev"
USERFILE="/home/angel/projects/agenda-uc/samba/usuarios.txt"
DEFAULT_PASSWORD="1234asdf*"

echo "🚀 Iniciando creación de usuarios en Samba AD..."
echo "📁 Archivo de usuarios: $USERFILE"
echo "🐳 Contenedor: $CONTAINER_NAME"
echo ""

# Verificar que el contenedor esté corriendo
if ! docker ps | grep -q "$CONTAINER_NAME"; then
  echo "❌ El contenedor $CONTAINER_NAME no está corriendo."
  echo "💡 Ejecuta: docker-compose up -d"
  exit 1
fi

# Verificar que el archivo de usuarios existe
if [ ! -f "$USERFILE" ]; then
  echo "❌ El archivo $USERFILE no existe."
  exit 1
fi

# Contador de usuarios procesados
count=0
created=0
errors=0

while IFS= read -r line; do
  # Saltar líneas vacías y comentarios
  if [[ -z "$line" || "$line" =~ ^# ]]; then
    continue
  fi

  email="$line"
  # Extraer la parte antes del @ como username
  username=$(echo "$email" | cut -d'@' -f1)
  
  echo "➕ Procesando: $username ($email)"
  
  # Intentar crear el usuario
  result=$(docker exec "$CONTAINER_NAME" samba-tool user create "$username" "$DEFAULT_PASSWORD" \
    --mail-address="$email" \
    --description="Usuario LDAP creado automáticamente" 2>&1)
  
  if [[ $? -eq 0 ]]; then
    echo "✅ Usuario $username creado exitosamente"
    created=$((created + 1))
    
    # Establecer la contraseña (por si acaso)
    docker exec "$CONTAINER_NAME" samba-tool user setpassword "$username" --newpassword="$DEFAULT_PASSWORD" > /dev/null 2>&1
  else
    if echo "$result" | grep -q "already exists"; then
      echo "⚠️  Usuario $username ya existe"
    else
      echo "❌ Error creando usuario $username: $result"
      errors=$((errors + 1))
    fi
  fi
  
  count=$((count + 1))
  echo ""
  
done < "$USERFILE"

echo "📊 Resumen:"
echo "   👥 Usuarios procesados: $count"
echo "   ✅ Creados exitosamente: $created"
echo "   ❌ Errores: $errors"
echo ""

# Listar todos los usuarios al final
echo "👥 Lista de usuarios actuales en el dominio:"
docker exec "$CONTAINER_NAME" samba-tool user list

echo ""
echo "✅ Proceso completado."