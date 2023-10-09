const { Group, Task, Price } = require('../sequelize')

const getTasks = async (req, res) => {
  try {
    const task = await Task.findAll({
      include: [{
        model: Group
      }, {
        model: Price
      }]
    })
    res.status(200).json(task)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const getTask = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const technician = await Task.findByPk(id, {
      include: Group
    })
    res.status(200).json(technician)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const updateTask = async (req, res) => {
  const { name, dateBorn } = req.body
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const technician = await Task.update({
      name,
      date_born: dateBorn
    }, {
      where: { id }
    })
    res.json(technician)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const createTask = async (req, res) => {
  const { name, dateBorn } = req.body

  try {
    const technician = await Task.create({
      name,
      date_born: dateBorn
    })
    res.json(technician)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const deleteTask = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const technician = await Task.destroy({ where: { id } })
    res.json(technician)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

module.exports = {
  getTasks,
  getTask,
  updateTask,
  createTask,
  deleteTask
}
