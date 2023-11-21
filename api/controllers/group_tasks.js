const { Group, Task, GroupTask, Price, Technician } = require('../sequelize')
const Sequelize = require("sequelize")

const getGroupTasks = async (req, res) => {
  try {
    const groupTasks = await GroupTask.findAll({
      include: [{
        model: Group
      }, {
        model: Task,
        include: {
          model: Price,
          order: [['createdAt', 'DESC']],
          limit: 1
        }
      }]
    })
    res.status(200).json(groupTasks)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const queryGroupTask = async (req, res) => {
  const { date_from, date_to, time_from, time_to, technicianId } = req.body

  try {
    const groupTask = await GroupTask.findAll({
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
          order: [['createdAt', 'DESC']],
          limit: 1
        }
      }]
    })
    const filter = groupTask.filter((groupTask) => groupTask.group != null)
    res.status(200).json(filter)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const createGroupTask = async (req, res) => {
  const { groupId, tasksId, dateCompleted, hour } = req.body
  console.log(`groupId: ${groupId}, taskId: ${tasksId}, dateCompleted: ${dateCompleted}, hour: ${hour}`)

  try {
    groupTasks = []
    tasksId.forEach(async (taskId) => {
      groupTasks.push(await GroupTask.create({
        groupId,
        taskId,
        date_completed: dateCompleted,
        hour
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
  queryGroupTask
}
