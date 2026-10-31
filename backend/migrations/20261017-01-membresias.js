// Crea la tabla Membresias (PascalCase y plural, como el resto) y elimina las dos tablas viejas
// que había en producción: "Membresia" (creada a mano) y "membresia" (creada por sync()).
// Si alguna tiene datos, se niega a borrarla para no perder información.
const { DataTypes } = require('sequelize');

const TABLAS_VIEJAS = ['Membresia', 'membresia'];

module.exports = {
  up: async ({ context: queryInterface }) => {
    const sequelize = queryInterface.sequelize;

    for (const tabla of TABLAS_VIEJAS) {
      const [[existe]] = await sequelize.query('SELECT to_regclass(:nombre) AS tabla', {
        replacements: { nombre: `public."${tabla}"` }
      });
      if (!existe.tabla) continue;
      const [[{ total }]] = await sequelize.query(`SELECT count(*)::int AS total FROM "${tabla}"`);
      if (total > 0) {
        throw new Error(
          `La tabla "${tabla}" tiene ${total} fila(s). Pasalas a Membresias a mano y volvé a migrar.`
        );
      }
    }
    for (const tabla of TABLAS_VIEJAS) await queryInterface.dropTable(tabla);

    await queryInterface.createTable('Membresias', {
      idMembresia: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
      dniCliente: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'clientes', key: 'dni' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fechaPago: { type: DataTypes.DATEONLY, allowNull: false },
      fechaInicio: { type: DataTypes.DATEONLY, allowNull: false },
      fechaVencimiento: { type: DataTypes.DATEONLY, allowNull: false },
      valor: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      createdAt: { type: DataTypes.DATE, allowNull: false },
      updatedAt: { type: DataTypes.DATE, allowNull: false }
    });
    await queryInterface.addIndex('Membresias', ['dniCliente']);
  },

  // Vuelve a no tener tabla de membresías (las viejas no se recrean)
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('Membresias');
  }
};
