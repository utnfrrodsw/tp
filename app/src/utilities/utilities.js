export function esMayorDe18(fechaNacimiento) {
  const partesFecha = fechaNacimiento.split('/')
  const fechaFormateada = partesFecha[2] + '-' + partesFecha[1] + '-' + partesFecha[0]
  const fechaNacimientoDate = new Date(fechaFormateada)
  const fechaActual = new Date()
  let diferenciaAnios = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear()
  if (
    fechaNacimientoDate.getMonth() > fechaActual.getMonth() ||
    (fechaNacimientoDate.getMonth() === fechaActual.getMonth() && fechaNacimientoDate.getDate() > fechaActual.getDate())
  ) {
    diferenciaAnios--
  }
  return diferenciaAnios > 18 || (diferenciaAnios === 18 && fechaNacimientoDate.getMonth() < fechaActual.getMonth()) || (diferenciaAnios === 18 && fechaNacimientoDate.getMonth() === fechaActual.getMonth() && fechaNacimientoDate.getDate() <= fechaActual.getDate());
}