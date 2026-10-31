// Una membresía por vencer es la que vence dentro de esta cantidad de días
const DIAS_POR_VENCER = 7;
const MAX_VALOR = 99999999.99; // DECIMAL(10,2)

const MS_POR_DIA = 24 * 60 * 60 * 1000;

// Fecha de hoy (YYYY-MM-DD) en la zona del gimnasio: el servidor puede estar en UTC
const hoy = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' });

// Valida un YYYY-MM-DD que exista de verdad (no acepta 2026-02-30). Devuelve la fecha o null
const fechaValida = (valor) => {
  if (typeof valor !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(valor)) return null;
  const fecha = new Date(`${valor}T00:00:00Z`);
  return !Number.isNaN(fecha.getTime()) && fecha.toISOString().slice(0, 10) === valor
    ? valor
    : null;
};

const diasEntre = (desde, hasta) =>
  Math.round((new Date(`${hasta}T00:00:00Z`) - new Date(`${desde}T00:00:00Z`)) / MS_POR_DIA);

// Devuelve un número con a lo sumo 2 decimales, entre 0 y MAX_VALOR, o null si no es válido
const valorValido = (valor) => {
  const numero = typeof valor === 'string' && valor.trim() !== '' ? Number(valor) : valor;
  if (typeof numero !== 'number' || !Number.isFinite(numero)) return null;
  if (numero < 0 || numero > MAX_VALOR) return null;
  return Math.round(numero * 100) / 100;
};

// 'Pendiente' (todavía no empezó), 'Activa', 'Por vencer' o 'Vencida'
const calcularEstado = ({ fechaInicio, fechaVencimiento }, fechaHoy = hoy()) => {
  if (fechaVencimiento < fechaHoy) return 'Vencida';
  if (fechaInicio > fechaHoy) return 'Pendiente';
  return diasEntre(fechaHoy, fechaVencimiento) <= DIAS_POR_VENCER ? 'Por vencer' : 'Activa';
};

module.exports = { hoy, fechaValida, valorValido, calcularEstado, DIAS_POR_VENCER };
