# Casos de Uso y Flujos - Agenda UC

## Introducción

Este documento describe los casos de uso y flujos principales del Sistema de Gestión de Reservas y Aseguramientos de la Universidad.

## Actores del Sistema

### Roles Base
- **Rector**: Máxima autoridad, aprueba eventos públicos
- **Directivo Institucional**: Privilegios administrativos globales
- **Administrador**: Gestiona usuarios, roles, áreas, locales y medios
- **Logístico**: Emite aseguramientos aprobados

### Roles Calculados
- **Directivo**: Derivado de directivos[] en Área
- **Almacenero**: Derivado de almaceneros[] en Área  
- **Responsable Local**: Derivado de responsables[] en Local
- **Responsable Medio**: Derivado de responsables[] en Medio

### Rol Universal
- **Usuario**: Rol base para todos los usuarios autenticados

## Casos de Uso

### Autenticación y Sesiones
- UC-A1: Iniciar sesión (LDAP/Keycloak)
- UC-A2: Cerrar sesión
- UC-A3: Consultar roles efectivos

### Gestión de Roles
- UC-R1: Asignar rol base
- UC-R2: Revocar rol base
- UC-R3: Ver historial de roles

### Maestros y Configuración
- UC-M1: Gestionar sedes
- UC-M2: Gestionar áreas
- UC-M3: Gestionar locales
- UC-M4: Gestionar medios

### Calendario y Eventos
- UC-E1: Crear evento personal
- UC-E2: Crear recordatorio
- UC-E3: Promover evento a reserva

### Reservas
- UC-RES1: Crear reserva
- UC-RES2: Aprobar/cancelar reserva
- UC-RES3: Consultar reservas

## Flujos Detallados

*Contenido a desarrollar*