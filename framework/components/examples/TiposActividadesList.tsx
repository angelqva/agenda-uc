import React from "react";
import { iconsMap, tiposActividades } from "@/config";
import type { ActividadConfig, IconKey } from "@/types";

interface ActividadItemProps {
  actividad: ActividadConfig;
}

function ActividadItem({ actividad }: ActividadItemProps) {
  const { id, nombre, icono } = actividad;
  
  return (
    <div
      key={id}
      className="flex items-center gap-2 rounded-md p-2 bg-neutral-800 text-white [&_svg]:size-9"
    >
      {iconsMap[icono as IconKey] || <span className="text-xl">❓</span>}
      <span className="text-lg">{nombre}</span>
    </div>
  );
}

export function TiposActividadesList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {tiposActividades.map((actividad) => (
        <ActividadItem key={actividad.id} actividad={actividad} />
      ))}
    </div>
  );
}
