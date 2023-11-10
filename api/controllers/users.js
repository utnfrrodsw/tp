const { User } = require('../sequelize')
const bcrypt = require('bcryptjs')

const getUsers = async (req, res) => {
  try {
    const user = await User.findAll()
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const getUser = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const user = await User.findByPk(id)
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const updateUser = async (req, res) => {
  const { name, lastName, email, password, active } = req.body
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  if (password) {
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(password, salt)
  }

  try {
    const user = await User.update({
      name,
      last_name: lastName,
      email,
      password,
      active
    }, {
      where: { id }
    })
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

module.exports = {
  getUsers,
  getUser,
  updateUser
}
