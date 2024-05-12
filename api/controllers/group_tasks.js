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
        }],
        where: Sequelize.literal(`NOT EXISTS (
          SELECT 1 FROM groups_technicians AS GT
          JOIN \`groups\` AS G ON GT.groupId = G.id
          WHERE G.id = groups_tasks.groupId 
          AND GT.technicianId = ${technicianId}
          AND (GT.date_assigned > groups_tasks.date_completed OR GT.date_end < groups_tasks.date_completed)
        )`)
      })

      const filtered = groupTask.filter(groupTask => groupTask.group != null)
      res.status(200).json(filtered)
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
