export function esMayorDe18(fechaNacimiento) {
  const fechaNacimientoDate = new Date(fechaNacimiento);
  const fechaActual = new Date();

  // Calcular la diferencia en años
  let diferenciaAnios = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();

  // Ajustar la diferencia si aún no ha pasado el cumpleaños en el año actual
  if (
    fechaNacimientoDate.getMonth() > fechaActual.getMonth() ||
    (fechaNacimientoDate.getMonth() === fechaActual.getMonth() && fechaNacimientoDate.getDate() > fechaActual.getDate())
  ) {
    diferenciaAnios--;
  }

  return diferenciaAnios > 18 || (diferenciaAnios === 18 && fechaNacimientoDate.getMonth() <= fechaActual.getMonth() && fechaNacimientoDate.getDate() <= fechaActual.getDate());
}