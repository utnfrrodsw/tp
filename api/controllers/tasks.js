const Sequelize = require('sequelize')
const { Group, Task, Price, sequelize } = require('../sequelize')

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
    const task = await Task.findByPk(id, {
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

const updateTask = async (req, res) => {
  const { name, price } = req.body
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const task = await Task.update({
      name
    }, {
      where: { id }
    })
    const priceTask = await Price.create({
      taskId: id,
      price
    })
    res.json(task)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const createTask = async (req, res) => {
  const { name, price } = req.body

  try {
    const task = await Task.create({
      name
    })
    const priceTask = await Price.create({
      taskId: task.id,
      price
    })
    res.json(task)
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
    const task = await Task.destroy({ where: { id } })
    res.json(task)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const sumTasks = async (req, res) => {
  try {
    const tasks = await sequelize.query(`
      SELECT t.id, t.name, COUNT(*) AS count
      FROM groups_tasks gt
      INNER JOIN tasks t ON gt.taskId = t.id
      WHERE gt.date_completed >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY t.id, t.name;
    `)

    res.status(200).json(tasks)
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
  deleteTask,
  sumTasks
}
