const { User } = require('../sequelize')
const config = require('../configs/config')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  var { name, last_name, email, password, role } = req.body

  if (!(name && last_name && email && password && role)) {
    return res.status(400).send('All input is required')
  }

  try {
    const userExists = await User.findOne({ where: { email } })

    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' })
    }

    if (role !== 'admin') {
      role = 'operator'
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)
    const user = await User.create({
      name,
      last_name,
      email,
      password: passwordHash,
      role: role
    })

    const payload = {
      user: {
        id: user.id,
        role: role
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
    const user = await User.findOne({ where: { email } })

    if (!user) {
      return res.status(400).json({ msg: 'The user does not exist' })
    }

    const correctPassword = await bcrypt.compare(password, user.password)

    if (!correctPassword) {
      return res.status(400).json({ msg: 'The email or password is incorrect' })
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    }

    jwt.sign(payload, config.jwt.signature, {
      expiresIn: 60 * 60 * 24 * 7
    }, (error, token) => {
      if (error) throw error
      res.status(202).json({ msg: 'Authenticated user', user, token })
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
