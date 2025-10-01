import slugify from "slugify";

export const tiposAseguramiento = [
    { nombre: 'Alojamiento', icono: 'solar:bed-bold', descripcion: 'Estancia para pernoctar durante el evento' },
    { nombre: 'Desayuno', icono: 'solar:cup-hot-bold', descripcion: 'Comida ligera de la mañana' },
    { nombre: 'Merienda del día', icono: 'solar:donut-bold', descripcion: 'Refrigerio en la mañana' },
    { nombre: 'Almuerzo', icono: 'emojione:pot-of-food', descripcion: 'Comida principal al mediodía' },
    { nombre: 'Merienda de la tarde', icono: 'solar:candy-bold', descripcion: 'Refrigerio en la tarde' },
    { nombre: 'Comida', icono: 'emoemojione-v1:pot-of-food', descripcion: 'Comida fuerte en la tarde o al anochecer' },
    { nombre: 'Cena', icono: 'mdi:food-croissant', descripcion: 'Comida ligera en la noche' },
].map((aseg) => ({
    ...aseg,
    id: `aseguramiento-${slugify(aseg.nombre, { lower: true, strict: true })}`,
}));
