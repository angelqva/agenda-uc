FROM node:22-alpine

WORKDIR /app

# Instalar dependencias
COPY ./framework/package*.json ./
RUN npm install

# Copiar el resto del código
COPY ./framework .


EXPOSE 3000

