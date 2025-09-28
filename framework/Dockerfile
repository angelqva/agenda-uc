FROM node:22-alpine

WORKDIR /app

# Instalar dependencias
COPY ./framework/package*.json ./
RUN npm install

# Copiar el resto del código
COPY ./framework .
COPY ./framework/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
EXPOSE 3000

