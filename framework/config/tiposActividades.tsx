import slugify from "slugify";
import type { ActividadConfig } from "@/types";

export const tiposActividades: ActividadConfig[] = [
  { nombre: 'Reunión', icono: 'solar:users-group-rounded-bold' },
  { nombre: 'Conferencia', icono: 'solar:mic-bold' },
  { nombre: 'Clase', icono: 'solar:book-2-bold' },
  { nombre: 'Evento cultural', icono: 'solar:gallery-bold' },
  { nombre: 'Taller', icono: 'solar:pen-bold' },
  { nombre: 'Seminario', icono: 'solar:document-bold' },
  { nombre: 'Defensa de tesis', icono: 'solar:graduation-cap-bold' },
  { nombre: 'Actividad deportiva', icono: 'solar:medal-ribbons-star-bold' },
  { nombre: 'Competencia académica', icono: 'solar:trophy-bold' },
  { nombre: 'Festival estudiantil', icono: 'solar:music-note-2-bold' },
  { nombre: 'Exposición científica', icono: 'solar:atom-bold' },
  { nombre: 'Encuentro empresarial', icono: 'solar:briefcase-bold' },
  { nombre: 'Encuentro internacional', icono: 'solar:globe-bold' },
  { nombre: 'Curso de posgrado', icono: 'solar:book-bold' },
  { nombre: 'Simposio', icono: 'solar:clipboard-bold' },
  { nombre: 'Actividad política', icono: 'solar:flag-bold' },
  { nombre: 'Círculo de estudios', icono: 'solar:bookmark-square-bold' },
  { nombre: 'Acto', icono: 'solar:flag-2-bold' },
].map((actividad) => ({
  ...actividad,
  id: `actividad-${slugify(actividad.nombre, { lower: true, strict: true })}`,
}));
