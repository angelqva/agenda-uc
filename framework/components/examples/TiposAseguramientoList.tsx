import React from "react";
import { iconsMap, tiposAseguramiento } from "@/config";
import type { AseguramientoConfig, IconKey } from "@/types";

interface AseguramientoItemProps {
  aseguramiento: AseguramientoConfig;
}

function AseguramientoItem({ aseguramiento }: AseguramientoItemProps) {
  const { id, nombre, icono, descripcion } = aseguramiento;
  
  return (
    <div
      key={id}
      className="flex items-center gap-2 rounded-md p-2 bg-neutral-800 text-white [&_svg]:size-9"
    >
      {iconsMap[icono as IconKey] || <span className="text-xl">❓</span>}
      <div className="flex flex-col">
        <span className="text-lg font-medium">{nombre}</span>
        {descripcion && (
          <span className="text-sm text-neutral-400">{descripcion}</span>
        )}
      </div>
    </div>
  );
}

export function TiposAseguramientoList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {tiposAseguramiento.map((aseguramiento) => (
        <AseguramientoItem key={aseguramiento.id} aseguramiento={aseguramiento} />
      ))}
    </div>
  );
}
