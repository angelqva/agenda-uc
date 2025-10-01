import { RolSistema } from "@/types";
import type { IconKey } from "@/types";

export const roleIconsMap: Record<RolSistema, { icon: IconKey; name: string }> = {
    [RolSistema.RECTOR]: { icon: "mdi:user-tie", name: "Rector" },
    [RolSistema.DIRECTIVO_INSTITUCIONAL]: { icon: "mdi:user-tie", name: "Directivo Institucional" },
    [RolSistema.ADMINISTRADOR]: { icon: "stash:shield-user", name: "Administrador" },
    [RolSistema.LOGISTICO]: { icon: "mdi:user-tie", name: "Logístico" },
    [RolSistema.DIRECTIVO]: { icon: "mdi:user-tie", name: "Directivo" },
    [RolSistema.ALMACENERO]: { icon: "iconoir:user-bag", name: "Almacenero" },
    [RolSistema.RESPONSABLE_LOCAL]: { icon: "tabler:user-pin", name: "Responsable Local" },
    [RolSistema.RESPONSABLE_MEDIO]: { icon: "tabler:user-cog", name: "Responsable Medio" },
    [RolSistema.USUARIO]: { icon: "mingcute:user-4-line", name: "Usuario" },
};
