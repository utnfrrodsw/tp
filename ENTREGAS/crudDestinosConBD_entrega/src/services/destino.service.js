const Destino = require('../models/destino.model');

const getAll = async () => await Destino.findAll();
const getById = async (id) => await Destino.findByPk(id);
const create = async (data) => await Destino.create(data);
const update = async (id, data) => {
  const destino = await Destino.findByPk(id);
  if (!destino) return null;
  return await destino.update(data);
};
const remove = async (id) => {
  const destino = await Destino.findByPk(id);
  if (!destino) return null;
  await destino.destroy();
  return destino;
};

module.exports = { getAll, getById, create, update, remove };
