import Link from "next/link";

export default function Page() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Panel De Control</h1>
      <Link href="/autenticacion/iniciar-sesion" className="text-blue-500 underline"> Ir a Iniciar Sesión</Link>
    </div>
  );
}