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
            model: Technician,
            through: {
              attributes: ['date_assigned', 'date_end']
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
            through: {
              attributes: ['date_assigned', 'date_end']
            },
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
      const filteredPrices = task.prices.filter(price => new Date(price.createdAt) <= new Date(groupTask.date_completed))
      const latestPrice = filteredPrices.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      const filterTechnicians = groupTask.group.technicians.filter(technician => {
        let gt = technician.groups_technicians
        let date_assigned = new Date(gt.date_assigned)
        let date_end = gt.date_end ? new Date(gt.date_end) : null
        let date_completed = new Date(`${groupTask.date_completed} ${groupTask.hour}`)
        console.log(date_assigned, date_completed, date_end)
        return date_assigned <= date_completed && (!date_end || date_end >= date_completed)
      })
      if (filterTechnicians.length === 0) return null

      return {
        groupId: groupTask.groupId,
        conection: groupTask.conection,
        taskId: groupTask.taskId,
        date_completed: groupTask.date_completed,
        quantity: groupTask.quantity,
        hour: groupTask.hour,
        observation: groupTask.observation,
        group: {
          id: groupTask.group.id,
          technicians: filterTechnicians,
          description: groupTask.group.description
        },
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
