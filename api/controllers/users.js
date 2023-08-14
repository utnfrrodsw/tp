const Users = require('../models/users')

const getUsers = async (req, res) => {
  try {
    const user = await Users.findAll()
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const getUser = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const user = await Users.findByPk(req.params.id)
    res.status(200).json(user)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const updateUser = async (req, res) => {
  const { name, lastName, email, password, active } = req.body

  if (!req.params.id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const user = await Users.update({
      name,
      last_name: lastName,
      email,
      password,
      active
    }, {
      where: {
        id: req.params.id
      }
    })
    res.json(user)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  getUsers,
  getUser,
  updateUser
}
