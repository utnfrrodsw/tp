// Convierte un valor de ruta/body a entero positivo, o null si no es válido
const toPositiveInt = (value) => {
  if (value === undefined || value === null) return null;
  const str = String(value).trim();
  if (!/^\d+$/.test(str)) return null;
  const num = Number(str);
  return num > 0 ? num : null;
};

const isValidEmail = (value) =>
  typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

// Loguea el error completo en el server y responde al cliente sin filtrar detalles internos
const sendError = (res, status, message, error) => {
  if (error) console.error(error);
  const body = { message };
  if (error && process.env.NODE_ENV !== 'production') body.error = error.message;
  res.status(status).json(body);
};

// true si no se pudo borrar porque otra tabla lo referencia. Postgres usa 23503 (foreign key) o
// 23001 (restrict) según cómo esté definida la clave, y Sequelize solo reconoce el primero
const esErrorDeReferencia = (error) =>
  error?.name === 'SequelizeForeignKeyConstraintError' ||
  ['23503', '23001'].includes(error?.parent?.code);

module.exports = { toPositiveInt, isValidEmail, sendError, esErrorDeReferencia };
