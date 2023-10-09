const { Group, Technician, Task } = require('../sequelize')

const getGroups = async (req, res) => {
  try {
    const groups = await Group.findAll({
      include: [{
        model: Technician
      }, {
        model: Task
      }]
    })
    res.status(200).json(groups)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const getGroup = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const group = await Group.findByPk(id, {
      include: Technician
    })
    res.status(200).json(group)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const updateGroup = async (req, res) => {
  const { id } = req.params
  const { name } = req.body

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const group = await Group.update({
      name
    }, {
      where: { id }
    })
    res.json(group)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const createGroup = async (req, res) => {
  const { name } = req.body

  try {
    const group = await Group.create({
      name
    })
    res.json(group)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const deleteGroup = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const group = await Group.destroy({
      where: { id }
    })
    res.json(group)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

module.exports = {
  getGroups,
  getGroup,
  updateGroup,
  createGroup,
  deleteGroup
}
