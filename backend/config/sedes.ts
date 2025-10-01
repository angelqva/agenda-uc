import slugify from "slugify";

export const sedes = [
    {
        nombre: 'Sede Ignacio Agramonte',
        ubicacion:
            'https://www.google.com/maps/place/Universidad+de+Camag%C3%BCey/@21.388154,-77.8853612,17z',
    },
    {
        nombre: 'Sede José Martí',
        ubicacion:
            'https://www.google.com/maps/place/Universidad+de+Ciencias+Pedag%C3%B3gicas+Jos%C3%A9+Mart%C3%AD/@21.391133,-77.8857808,16.75z',
    },
    {
        nombre: 'Sede Manuel Fajardo',
        ubicacion: 'https://www.google.com/maps/@21.3712123,-77.8787979,17.08z',
    },
].map((sede) => ({
    ...sede,
    id: `sede-${slugify(sede.nombre, { lower: true, strict: true })}`,
}));
