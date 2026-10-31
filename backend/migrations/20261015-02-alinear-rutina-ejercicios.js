// En la base de producción la tabla se creó a mano y quedó distinta del modelo: estas columnas
// aceptaban NULL y el descanso no tenía valor por defecto. En una base nueva no cambia nada.
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "RutinaEjercicios"
        ALTER COLUMN "nombreEjercicio" SET NOT NULL,
        ALTER COLUMN "series" SET NOT NULL,
        ALTER COLUMN "repeticiones" SET NOT NULL,
        ALTER COLUMN "descanso" SET DEFAULT 60,
        ALTER COLUMN "createdAt" SET NOT NULL,
        ALTER COLUMN "updatedAt" SET NOT NULL
    `);
  },

  // No se vuelve atrás: aceptar NULL de nuevo no tiene sentido para el modelo
  down: async () => {}
};
