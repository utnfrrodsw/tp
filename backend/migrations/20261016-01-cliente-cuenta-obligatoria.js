// Todo cliente tiene cuenta (y por lo tanto email, que es su usuario). Falla, sin cambiar nada,
// si hay clientes sin cuenta o sin email: hay que corregirlos o borrarlos antes de migrar.
module.exports = {
  up: async ({ context: queryInterface }) => {
    const sequelize = queryInterface.sequelize;
    const [pendientes] = await sequelize.query(
      'SELECT dni FROM clientes WHERE "idUsuario" IS NULL OR email IS NULL ORDER BY dni'
    );
    if (pendientes.length) {
      throw new Error(
        `Hay clientes sin cuenta o sin email (DNI: ${pendientes.map((c) => c.dni).join(', ')}). ` +
          'Borralos o completá sus datos y volvé a migrar.'
      );
    }
    await sequelize.query(`
      ALTER TABLE clientes
        ALTER COLUMN "idUsuario" SET NOT NULL,
        ALTER COLUMN email SET NOT NULL,
        DROP CONSTRAINT "clientes_idUsuario_fkey",
        ADD CONSTRAINT "clientes_idUsuario_fkey" FOREIGN KEY ("idUsuario")
          REFERENCES "Usuarios"(id) ON UPDATE CASCADE ON DELETE RESTRICT
    `);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE clientes
        ALTER COLUMN "idUsuario" DROP NOT NULL,
        ALTER COLUMN email DROP NOT NULL,
        DROP CONSTRAINT "clientes_idUsuario_fkey",
        ADD CONSTRAINT "clientes_idUsuario_fkey" FOREIGN KEY ("idUsuario")
          REFERENCES "Usuarios"(id) ON UPDATE CASCADE ON DELETE SET NULL
    `);
  }
};
