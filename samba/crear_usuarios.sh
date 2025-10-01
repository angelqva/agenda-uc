#!/bin/bash
# Script para crear usuarios en Samba AD a partir de correos
# Dominio: REDUC.EDU.CU
# Uso: ./crear_usuarios.sh usuarios.txt

DOMAIN="REDUC.EDU.CU"

if [ -z "$1" ]; then
  echo "❌ Debes pasar un archivo con la lista de correos (uno por línea)."
  exit 1
fi

USERFILE="$1"

while IFS= read -r email; do
  # Extraer la parte antes del @ como username
  username=$(echo "$email" | cut -d'@' -f1)

  echo "➕ Creando usuario: $username con correo $email"

  # Crear el usuario en Samba
  samba-tool user create "$username" "1234asdf*" \
    --mail-address="$email" \
    --description="Usuario LDAP creado automáticamente"

  samba-tool user setpassword "$username" --newpassword=1234asdf*

done < "$USERFILE"

echo "✅ Proceso completado."
