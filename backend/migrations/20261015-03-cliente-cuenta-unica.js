// Una cuenta de usuario pertenece a un solo cliente
module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addConstraint('clientes', {
      fields: ['idUsuario'],
      type: 'unique',
      name: 'clientes_idUsuario_key'
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeConstraint('clientes', 'clientes_idUsuario_key');
  }
};
