
// Valida el formato de un email: exige texto antes de la arroba, un dominio
// después y al menos un punto en ese dominio (ej. usuario@planit.com).
export const esEmailValido = (email: string): boolean => {
  const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return formato.test(email.trim());
};
