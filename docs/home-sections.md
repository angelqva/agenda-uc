Crea una landing page moderna, elegante y tecnológica para el sistema **Agenda UC**, utilizando el tema oscuro de **Hero UI** con la siguiente paleta:

- Fondo principal: `#000000`
- Texto principal: `#ffffff`
- Texto secundario: `#b2b2b5`
- Primario: `#2c30b1`
- Secundario: `#651eab`
- Bloques: `#18181b`, `#27272a`, `#3f3f46`
- Bordes: `border-white/10`
- Efectos: `backdrop-blur-sm`, `shadow-[0_0_20px_rgba(44,48,177,0.15)]`

Tipografía recomendada: **Inter** o **Poppins**, pesos 400–700.  
Usa bordes redondeados, efectos *glassmorphism*, degradados azul-violeta y animaciones suaves tipo *fade-in* y *slide-up*.

---

## 🏠 Sección 1: Inicio (Hero principal)

**Objetivo:** Introducir el sistema y causar impacto visual inmediato.

**Diseño:**
- Fondo degradado radial `from-[#0d0d0e] via-[#151754] to-[#000000]`.
- Layout: texto a la izquierda y cards flotantes de funcionalidades a la derecha.
- Cards con efecto “frosted glass” (`bg-content2/70 backdrop-blur-sm rounded-2xl`), opacidad suave y movimiento flotante aleatorio.

**Contenido textual:**
- Título principal (5xl–6xl):  
  **“Gestiona reservas y aseguramientos universitarios con facilidad.”**
  - Resalta la palabra “reservas” con color primario `#2c30b1`.
- Subtítulo (gris claro `#b2b2b5`):  
  “Agenda UC centraliza los procesos de reserva, aprobación y aseguramiento dentro de la Universidad de Camagüey.”
- Botones:
  - Azul primario → **“Explorar características”**
  - Violeta contorneado → **“Ver tutoriales”**

**Cards flotantes (derecha):**
- Íconos + texto breve, semi desorganizados en una cuadrícula tipo collage.
  - 📅 Calendario inteligente  
  - ⚙️ Gestión de locales  
  - 🧾 Órdenes de aseguramiento  
  - 🧑‍💼 Roles institucionales  
  - 📬 Notificaciones automáticas  
  - 🔎 Trazabilidad completa
- Animaciones: *float, scale-hover 1.05*, brillo azul-violeta en hover.

---

## ⚙️ Sección 2: Características principales

**Inspiración visual:** el bloque “Themeable / Fast / Light & Dark UI / Unique DX” de Hero UI.

**Diseño:**
- Fondo `#000000` con degradado leve azul-violeta.
- Cuadrícula de 2 filas × 3 columnas (responsive a 1 columna en móvil).
- Cards `bg-content2/70 backdrop-blur-sm border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(44,48,177,0.15)]`.

**Contenido de cada card:**
1. **📅 Calendarios Inteligentes**  
   Visualiza reservas por local, medio o aseguramiento desde un panel unificado.

2. **🧭 Gestión de Locales y Medios**  
   Administra espacios con responsables asignados y disponibilidad en tiempo real.

3. **🧾 Órdenes de Aseguramiento**  
   Crea y aprueba recursos logísticos asociados a eventos.

4. **📬 Notificaciones Automáticas**  
   Recibe alertas instantáneas sobre aprobaciones y cambios.

5. **🧑‍💼 Roles Institucionales**  
   Cada usuario actúa según su rol: Rector, Logístico, Responsable o Administrador.

6. **🔎 Trazabilidad Completa**  
   Rastrea reservas y órdenes con registros detallados.

**Hover:** iluminación violeta y efecto *scale-105* con sombra azul.  
**Animación de entrada:** *fade-in + slide-up staggered*.

---

## 🛡️ Sección 3: Seguridad y Confianza

**Inspiración visual:** el bloque “Last but not least” de Hero UI.

**Diseño:**
- Fondo oscuro con leve gradiente `from-[#0d0d0e] to-[#151754]`.
- Título grande:  
  **“Seguridad ante todo.”**
  - “Seguridad” en azul `#2c30b1`
  - “ante todo” en violeta `#651eab`
- Subtítulo:  
  “Agenda UC protege los datos institucionales con autenticación segura, control de permisos y trazabilidad completa.”

**Cuadrícula de 2 filas × 3 columnas:**
- Cards con ícono, título violeta y texto gris claro:
  1. **🔒 Autenticación Institucional** — Ingreso mediante cuenta LDAP o Google Auth.
  2. **🧩 Roles y Permisos** — Accesos controlados según jerarquía universitaria.
  3. **💾 Almacenamiento Seguro** — PostgreSQL con auditoría y respaldo automático.
  4. **🕵️ Sistema de Trazas** — Cada acción registrada para control y transparencia.
  5. **⚙️ Validación Tipada** — Next.js + Prisma + Zod garantizan estabilidad.
  6. **📬 Logs y Notificaciones** — Eventos y alertas auditables en tiempo real.

**Estilo visual:**
- `bg-content2/80 backdrop-blur-sm rounded-2xl border border-white/10`.
- Hover: *glow azul*, *ring-1 ring-[#2c30b1]/40*, *scale-105*.
- Íconos en tonos azul-violeta.

**Animaciones:** entrada suave tipo *fade-up*, con leve *parallax* si es posible.

---

## 🎓 Sección 4: Tutoriales interactivos

**Inspiración visual:** el bloque “Accessibility out of the box” de Hero UI.

**Diseño de layout:**
- Dos columnas:
  - **Izquierda:** lista vertical de minicards (selector de video).
  - **Derecha:** contenedor del video activo con fondo degradado azul→violeta (`from-[#2c30b1] to-[#651eab]`).

**Columna izquierda (minicards):**
- Cards pequeñas `bg-content2/80 backdrop-blur-sm border border-white/10 rounded-xl`.
- Contienen ícono + título + descripción corta.
- Hover: *scale-105* con borde azul, selección activa con `ring-[#2c30b1]`.
- Animación de hover con brillo violeta tenue.

**Contenido de minicards:**
1. 🎥 **Crear una reserva** — Cómo registrar una nueva reserva.  
2. 🎥 **Aprobar un evento** — Proceso de aprobación por responsable.  
3. 🎥 **Emitir una orden de aseguramiento** — Asignar recursos logísticos.  
4. 🎥 **Configurar locales y responsables** — Gestión administrativa.  
5. 🎥 **Gestionar notificaciones** — Control de alertas y mensajes.

**Columna derecha (video activo):**
- Mockup o video embed con borde redondeado grande (`rounded-3xl`).
- Sombra suave azul `shadow-[#2c30b1]/30`.
- Encabezado “Tutorial activo” + botón “Ver completo”.
- Transición *fade-in* al cambiar de video.
- Al seleccionar una minicard, el video cambia dinámicamente con animación.

**Responsive:**  
En móvil, las minicards se muestran arriba y el video abajo.

---

## 🧾 Footer

- Fondo `#0d0d0e`, borde superior `#2c30b1`.
- Texto centrado gris claro `#8c8c90`:  
  > © 2025 Universidad de Camagüey — Proyecto Agenda UC

---

## 💫 Estilo y animaciones globales

- **Modo oscuro puro** con alto contraste.
- **Efectos glassmorphism** consistentes en todas las secciones.
- **Transiciones suaves** para hover, focus y scroll (*motion-safe*).
- **Navegación fija superior** (`sticky top-0 backdrop-blur-md bg-black/40`).
- **Animaciones flotantes** y leves *parallax* en cards del hero.
- **Scroll reveal animations:** *fade-up*, *slide-in*, *scale* según visibilidad.
- **Responsive completo** (desktop, tablet, móvil).

---

**Objetivo final:**
Diseñar una **landing page profesional, moderna y coherente**, que muestre la tecnología, seguridad y funcionalidad de **Agenda UC**, manteniendo la estética de Hero UI con una identidad institucional sólida.
