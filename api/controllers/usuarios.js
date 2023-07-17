const Usuario = require('../models/usuario')

const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll()
    res.status(200).json(usuarios)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const getUsuario = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const usuario = await Usuario.findByPk(req.params.id)
    res.status(200).json(usuario)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const updateUsuario = async (req, res) => {
  const { nombre, apellido, email, password, activo } = req.body

  if (!req.params.id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const usuario = await Usuario.update({
      nombre,
      apellido,
      email,
      password,
      activo
    }, {
      where: {
        id: req.params.id
      }
    })
    res.json(usuario)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getUsuarios,
  getUsuario,
  updateUsuario
}
