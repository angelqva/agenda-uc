# LDAP / Samba - Comandos rápidos

Archivo con comandos listos para copiar y ejecutar que usan `docker compose exec samba-ad`.

Notas importantes antes de ejecutar
- Ejecuta estos comandos desde la raíz del repo donde está `docker-compose.yml`.
- Usa las versiones con comillas simples alrededor de `sh -c '...'` para evitar la expansión de `!` en tu shell.

1) Crear un usuario (ejemplo)

```bash
docker compose exec samba-ad sh -c 'samba-tool user create juan.perez "Passw0rd!" --given-name="Juan" --surname="Perez"'
```

Reemplaza `juan.perez` y la contraseña por los valores que quieras.

2) Crear usuario y forzar cambio de contraseña al primer login

```bash
docker compose exec samba-ad sh -c 'samba-tool user create ana.gomez "OtroPassw0rd!" --given-name="Ana" --surname="Gomez" --must-change-at-next-login'
```

3) Añadir usuario a grupo (ej. Domain Admins)

```bash
docker compose exec samba-ad sh -c 'samba-tool group addmembers "Domain Admins" juan.perez'
```

4) Listar usuarios y buscar uno concreto

```bash
docker compose exec samba-ad sh -c 'samba-tool user list | grep juan.perez || echo "No encontrado"'
```

5) Mostrar detalles de un usuario

```bash
docker compose exec samba-ad sh -c 'samba-tool user show juan.perez'
```

6) Cambiar/forzar contraseña de un usuario

```bash
docker compose exec samba-ad sh -c 'samba-tool user setpassword Administrator --newpassword="1234asdf*"'
```

7) Borrar usuario

```bash
docker compose exec samba-ad sh -c 'samba-tool user delete juan.perez'
```

8) Crear varios usuarios desde un CSV (ejemplo simple)
- CSV con formato: username,GivenName,Surname,Password

```bash
# Suponiendo users.csv en la raíz
while IFS=, read -r user given surname pass; do
  docker compose exec samba-ad sh -c "samba-tool user create $user \"$pass\" --given-name=\"$given\" --surname=\"$surname\""
done < users.csv
```

Consejos y advertencias
- Siempre usa comillas simples alrededor de la instrucción que pasas a `sh -c '...'` para evitar que tu shell interprete caracteres especiales (como `!`).
- Si necesitas que los comandos corran como root en el contenedor, añade `--user root` a `docker compose exec`:

```bash
docker compose exec --user root samba-ad sh -c 'samba-tool user create ...'
```

- Estos comandos asumen que el servicio se llama `samba-ad` en tu `docker-compose.yml`. Ajusta el nombre si difiere.
- Para operaciones masivas en producción, usa un flujo de provisión seguro y no guardes contraseñas en texto plano.

Si quieres, puedo generar ejemplos para varios usuarios o crear un pequeño script `create-users.sh` listo para ejecutar.
