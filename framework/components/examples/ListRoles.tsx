import React from "react";
import { roleIconsMap, iconsMap } from "@/config";
import type { RolSistema, IconKey } from "@/types";

interface RoleItemProps {
  rol: RolSistema;
  icon: IconKey;
  name: string;
}

function RoleItem({ rol, icon, name }: RoleItemProps) {
  return (
    <div
      key={rol}
      className="flex items-center gap-2 rounded-md p-2 bg-neutral-800 text-white [&_svg]:size-9"
    >
      {iconsMap[icon] || <span className="text-xl">❓</span>}
      <span className="text-lg">{name}</span>
    </div>
  );
}

export function RolesList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {Object.entries(roleIconsMap).map(([rol, { icon, name }]) => (
        <RoleItem
          key={rol}
          rol={rol as RolSistema}
          icon={icon}
          name={name}
        />
      ))}
    </div>
  );
}