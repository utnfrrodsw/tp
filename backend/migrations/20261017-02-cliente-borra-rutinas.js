// Al borrar un cliente se borran también sus rutinas (y sus ejercicios, que ya se borran con la
// rutina). Antes la base lo impedía y había que borrarlas a mano. El frontend avisa antes.
// Las rutinas de un profesor siguen bloqueando el borrado del profesor: son también del cliente.
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Rutinas"
        DROP CONSTRAINT "Rutinas_dniCliente_fkey",
        ADD CONSTRAINT "Rutinas_dniCliente_fkey" FOREIGN KEY ("dniCliente")
          REFERENCES clientes(dni) ON UPDATE NO ACTION ON DELETE CASCADE
    `);
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.query(`
      ALTER TABLE "Rutinas"
        DROP CONSTRAINT "Rutinas_dniCliente_fkey",
        ADD CONSTRAINT "Rutinas_dniCliente_fkey" FOREIGN KEY ("dniCliente")
          REFERENCES clientes(dni) ON UPDATE NO ACTION ON DELETE NO ACTION
    `);
  }
};
