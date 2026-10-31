// Pone en mayúscula la primera letra de cada palabra de un título (ej. evento),
// y normaliza espacios/mayúsculas sueltas que pueda tipear el usuario.
export function formatearTitulo(texto: string): string {
  if (!texto) return '';

  return texto
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');
}
