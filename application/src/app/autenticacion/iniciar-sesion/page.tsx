import { LoginForm } from '@/components/forms/LoginForm';

/**
 * @page LoginPage
 * @description Página de inicio de sesión que renderiza el componente de formulario.
 * Es un Server Component que delega la interactividad al `LoginForm`.
 */
export default function LoginPage() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">¡Bienvenido!</h1>
          <p className="py-6">
            Inicia sesión para acceder a la Agenda Universitaria. Gestiona tus eventos, calendarios y
            aseguramientos de manera centralizada.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
