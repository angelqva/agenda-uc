import slugify from "slugify";
import type { AseguramientoConfig } from "@/types";

export const tiposAseguramiento: AseguramientoConfig[] = [
    { nombre: 'Alojamiento', icono: 'solar:bed-bold', descripcion: 'Hospedaje para participantes' },
    { nombre: 'Desayuno', icono: 'solar:cup-hot-bold', descripcion: 'Desayuno para los asistentes' },
    { nombre: 'Merienda del día', icono: 'solar:donut-bold', descripcion: 'Merienda en la mañana' },
    { nombre: 'Almuerzo', icono: 'solar:chef-hat-bold', descripcion: 'Almuerzo principal' },
    { nombre: 'Merienda de la tarde', icono: 'solar:candy-bold', descripcion: 'Merienda en la tarde' },
    { nombre: 'Comida', icono: 'solar:dish-bold', descripcion: 'Comida ligera' },
    { nombre: 'Cena', icono: 'solar:cloche-bold', descripcion: 'Cena completa' },
].map((aseg) => ({
    ...aseg,
    id: `aseguramiento-${slugify(aseg.nombre, { lower: true, strict: true })}`,
}));
