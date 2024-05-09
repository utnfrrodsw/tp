const { Group, Task, GroupTask, Price, Technician } = require('../sequelize')
const Sequelize = require("sequelize")

const getGroupTasks = async (req, res) => {
  const { date_from, date_to, time_from, time_to, technicianId } = req.query
  try {
    if (!date_from || !date_to || !time_from || !time_to || !technicianId) {
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
    } else {
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
    }
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const createGroupTask = async (req, res) => {
  const { groupId,conection, tasksId, dateCompleted,quantity, hour, observation } = req.body
  console.log(`groupId: ${groupId},conection: ${conection} taskId: ${tasksId}, dateCompleted: ${dateCompleted},quantity:${quantity}, hour: ${hour},observation:${observation}`)

  try {
    groupTasks = []
    taskId.forEach(async (taskId) => {
      groupTasks.push(await GroupTask.create({
        groupId,
        conection,
        taskId: taskId.name,
        date_completed: dateCompleted,
        quantity:taskId.quantity,
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
