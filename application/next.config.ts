import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    /**
     * Indica a Next.js (tanto a Webpack como a Turbopack) que no incluya
     * estos paquetes en el bundle del servidor, sino que los trate como
     * dependencias externas que se resolverán en tiempo de ejecución en Node.js.
     *
     * Esto es crucial para paquetes como 'ldapts' que dependen de APIs de Node.js
     * y no deben ser procesados por el compilador.
     *
     * @see https://nextjs.org/docs/app/api-reference/next-config-js/serverComponentsExternalPackages
     */
    serverComponentsExternalPackages: ['ldapts'],
  },
  // La configuración de Webpack ya no es estrictamente necesaria para este caso
  // si se usa `serverComponentsExternalPackages`, pero se puede mantener por
  // compatibilidad o para otras personalizaciones de Webpack.
  // Por limpieza, la eliminamos para usar el método unificado.
};

export default nextConfig;
