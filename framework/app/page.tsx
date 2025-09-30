import { AuthButton } from "@/components/AuthButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { UsuarioFormExample } from "@/components/examples/UsuarioFormExample";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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

        {/* Componente de ejemplo del sistema de errores */}
        <UsuarioFormExample />

        <div className="flex gap-4 items-center flex-col sm:flex-row mt-8">
          <AuthButton />
          <ThemeToggle />
        </div>
      </main>
    </div>
  );
}
