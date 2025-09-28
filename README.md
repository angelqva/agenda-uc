# AGENDA UC

## INSTALAR

### DOCKER
```bash
#generate user for permissions
echo "PUID=$(id -u)" >> .env
echo "PGID=$(id -g)" >> .env
```
```bash
#start containers
docker-compose up -d
#consola del contendeor de next
docker exec -it agenda_app_dev sh

```