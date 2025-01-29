const { Group, Task, GroupTask, Price, Technician } = require('../sequelize')
const Sequelize = require('sequelize')

const getGroupTasks = async (req, res) => {
  const { date_from, date_to, time_from, time_to, technicianId } = req.query
  try {
    let groupTasks = []
    if (!date_from || !date_to || !time_from || !time_to || !technicianId) {
      groupTasks = await GroupTask.findAll({
        include: [{
          model: Group,
          include: {
            model: Technician
          }
        }, {
          model: Task,
          include: {
            model: Price,
            order: [['createdAt', 'DESC']]
          }
        }]
      })
    } else {
      groupTask = await GroupTask.findAll({
        where: {
          date_completed: {
            [Sequelize.Op.between]: [date_from, date_to]
          },
          hour: {
            [Sequelize.Op.between]: [time_from, time_to]
          }
        },
        include: [{
          model: Group,
          include: {
            model: Technician,
            where: {
              id: technicianId
            }
          }
        }, {
          model: Task,
          include: {
            model: Price,
            order: [['createdAt', 'DESC']]
          }
        }]
      })
    }
    const groupTasksPrice = groupTasks.map(groupTask => {
      const task = groupTask.task
      const filteredPrices = task.prices.filter(price => {
        return new Date(price.createdAt) <= new Date(groupTask.date_completed)
      })
      const latestPrice = filteredPrices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]

      return {
        groupId: groupTask.groupId,
        conection: groupTask.conection,
        taskId: groupTask.taskId,
        date_completed: groupTask.date_completed,
        quantity: groupTask.quantity,
        hour: groupTask.hour,
        observation: groupTask.observation,
        group: groupTask.group,
        task: {
          id: task.id,
          name: task.name,
          prices: task.prices,
          price: latestPrice?.price
        }
      }
    })
    res.status(200).json(groupTasksPrice)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const createGroupTask = async (req, res) => {
  const { groupId, conection, tasks, dateCompleted, hour, observation } = req.body

  try {
    groupTasks = []
    tasks.forEach(async (task) => {
      groupTasks.push(await GroupTask.create({
        groupId,
        conection,
        taskId: task.id,
        date_completed: dateCompleted,
        quantity: task.quantity,
        hour,
        observation
      }))
    })
    res.json(groupTasks)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

module.exports = {
  getGroupTasks,
  createGroupTask
}
