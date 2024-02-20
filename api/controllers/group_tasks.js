const { Group, Task, GroupTask, Price, Technician } = require('../sequelize')
const Sequelize = require("sequelize")

const getGroupTasks = async (req, res) => {
  const { date_from, date_to, time_from, time_to, technicianId } = req.body

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
  const { groupId,conection, tasksId, dateCompleted, hour,observation } = req.body
  

  try {
    groupTasks = []
    tasksId.forEach(async (tasksId) => {
      groupTasks.push(await GroupTask.create({
        date_completed: dateCompleted,
        conection,
        quantity: tasksId.quantity,
        hour,
        observation,
        taskId: tasksId.name,
        groupId:groupId,
      },
      console.log(groupId,conection, tasksId, dateCompleted, hour,observation)
      ))
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
