#!/bin/sh
set -e

echo "🔧 Ajustando permisos de /app a UID=$PUID y GID=$PGID..."
chown -R $PUID:$PGID /app

exec "$@"
