const { Group, Task, GroupTask, Price, Technician, GroupTechnician } = require('../sequelize')
const Sequelize = require("sequelize")

const getGroupTasks = async (req, res) => {
  const { date_from, date_to, time_from, time_to, technicianId } = req.query
  try {
    if (!date_from || !date_to || !time_from || !time_to || !technicianId) {
      const groupTasks = await GroupTask.findAll({
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
            order: [['createdAt', 'DESC']]
          }
        }]
      })

      res.status(200).json(groupTask)
    }
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
