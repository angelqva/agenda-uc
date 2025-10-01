/**
 * Utilidades para generación de IDs
 */

import { createId } from '@paralleldrive/cuid2';

/**
 * Genera un nuevo CUID2 (más seguro y eficiente que CUID)
 * Usar esta función cuando necesites generar IDs en el código
 * @returns string - Un nuevo CUID2
 */
export function generateId(): string {
  return createId();
}

/**
 * Genera un CUID2 corto (10 caracteres)
 * Útil para referencias, códigos o IDs más cortos
 * @returns string - Un CUID2 corto
 */
export function generateShortId(): string {
  return createId().slice(0, 10);
}

/**
 * Valida si un string es un CUID2 válido
 * @param id - El ID a validar
 * @returns boolean - true si es un CUID2 válido
 */
export function isValidCuid2(id: string): boolean {
  // CUID2 pattern: starts with letter, followed by alphanumeric
  const cuid2Pattern = /^[a-z][a-z0-9]*$/;
  return cuid2Pattern.test(id) && id.length >= 2 && id.length <= 32;
}

// Re-export para conveniencia
export { createId } from '@paralleldrive/cuid2';