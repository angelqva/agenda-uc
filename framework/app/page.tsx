import { AuthButton } from "@/components/AuthButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Image from "next/image";
import { iconsMap } from "@/config";
import { RolesList, TiposActividadesList, TiposAseguramientoList } from "@/components/examples";

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-3xl font-bold">Sistema de Gestión UC</h1>
          <p className="text-lg text-muted-foreground">
            Ejemplo de manejo avanzado de errores por campo
          </p>
        </div>

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <AuthButton />
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-4xl space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Iconos del Sistema</h2>
            <div className="flex gap-4 items-center flex-wrap">
              {Object.keys(iconsMap).slice(0, 10).map((key) => (
                <span key={key} className="flex rounded-md p-2 bg-neutral-800 text-white text-xl">
                  {iconsMap[key]}
                </span>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Roles del Sistema</h2>
            <RolesList />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tipos de Actividades</h2>
            <TiposActividadesList />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Tipos de Aseguramientos</h2>
            <TiposAseguramientoList />
          </section>
        </div>
      </main>
    </div>
  );
}
