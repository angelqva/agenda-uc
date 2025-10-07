import Link from "next/link";

export default function PageHome() {
  return (
    <main className="container mx-auto p-4">
      <section id="inicio" className="w-full h-screen">
        <h2>Section Inicio</h2>
      </section>
      <section id="caracteristicas" className="w-full h-screen">
        <h2>Section características</h2>
      </section>
      <section id="seguridad" className="w-full h-screen">
        <h2>Section seguridad</h2>
      </section>
      <section id="tutoriales" className="w-full h-screen">
        <h2>Section tutoriales</h2>
      </section>
    </main>
  );
}
