const Usuario = require('../models/usuario')
const config = require('../configs/config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { nombre, apellido, email, password } = req.body

  if (!(nombre && apellido && email && password)) {
    return res.status(400).send('All input is required')
  }

  try {
    const usuarioExists = await Usuario.findOne({ where: { email } })

    if (usuarioExists) {
      return res.status(400).json({ msg: 'User already exists' })
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password: passwordHash
    })

    const payload = {
      usuario: {
        id: usuario.id
      }
    }

    jwt.sign(payload, config.jwt.signature, {
      expiresIn: 60 * 60 * 24 * 7
    }, (error, token) => {
      if (error) throw error
      res.status(201).json({ msg: 'User created', token })
    })
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!(email && password)) {
    return res.status(400).send('All input is required')
  }

  try {
    const usuario = await Usuario.findOne({ where: { email } })

    if (!usuario) {
      return res.status(400).json({ msg: 'The user does not exist' })
    }

    console.log(usuario.password, password)
    const correctPassword = await bcrypt.compare(password, usuario.password)

    if (!correctPassword) {
      return res.status(400).json({ msg: 'The email or password is incorrect' })
    }

    const payload = {
      usuario: {
        id: usuario.id
      }
    }

    jwt.sign(payload, config.jwt.signature, {
      expiresIn: 60 * 60 * 24 * 7
    }, (error, token) => {
      if (error) throw error
      res.status(202).json({ msg: 'Authenticated user', usuario, token })
    })
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

module.exports = {
  register,
  login
}
