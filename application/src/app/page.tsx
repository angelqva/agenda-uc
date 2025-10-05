import Link from "next/link";

export default function PageHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Página de Inicio</h1>
      <p className="mt-4">Bienvenido a la página de inicio de la aplicación.</p>
      <Link href="/autenticacion/iniciar-sesion" className="text-blue-500 underline"> Ir a Iniciar Sesión</Link>
    </div>
  );
}
