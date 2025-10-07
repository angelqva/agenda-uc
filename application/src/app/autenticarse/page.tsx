import { LoginForm } from '@/components/forms/login';
import { subtitle, title } from '@/components/ui/primitives';

/**
 * @page LoginPage
 * @description Página de inicio de sesión que renderiza el componente de formulario.
 * Es un Server Component que delega la interactividad al `LoginForm`.
 */
export default function LoginPage() {
  return (
    <main className='container mx-auto p-4'>
      <div className="mx-auto max-w-lg py-16">

        <div className="text-center mb-10">
          <h1 className="text-5xl">
            <span className={title({ color: "blue" })}>¡Bienvenido!</span>
          </h1>
          <p className={subtitle({ class: "mt-6" })}>
            Inicia sesión para acceder a la Agenda Universitaria. Gestiona tus eventos, calendarios y
            aseguramientos de manera centralizada.
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
