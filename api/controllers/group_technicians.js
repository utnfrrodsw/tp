const Sequelize = require('sequelize')
const { Technician, GroupTechnician } = require('../sequelize')

const createGroupTechnician = async (req, res) => {
  const { groupId, technicianId } = req.body
  console.log(`groupId: ${groupId}, technicianId: ${technicianId}`)

  try {
    const groupTechnician = await GroupTechnician.create({
      groupId,
      technicianId,
      date_assigned: Sequelize.fn('NOW')
    })
    res.json(groupTechnician)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const deleteGroupTechnician = async (req, res) => {
  const { groupId, technicianId } = req.body
  console.log(`groupId: ${groupId}, technicianId: ${technicianId}`)

  try {
    const groupTechnician = await GroupTechnician.update(
      { 
        date_end: new Date()
      },
      {
        where: {
          groupId,
          technicianId
        }
      }
    )
    res.json(groupTechnician)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const freeTechnicians = async (req, res) => {
  try {
    const techniciansInAssignments = await GroupTechnician.findAll({
      attributes: ['technicianId'],
      where: {
        date_end: null
      },
      raw: true
    })

    const technicianIdsInAssignments = techniciansInAssignments.map((tech) => tech.technicianId)

    const freeTechniciansDetails = await Technician.findAll({
      where: {
        id: {
          [Sequelize.Op.notIn]: technicianIdsInAssignments
        }
      }
    })

    res.status(200).json(freeTechniciansDetails)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const getTechnicians = async (req, res) => {
  const { groupId } = req.params

  if (!groupId) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const techniciansInGroup = await GroupTechnician.findAll({
      attributes: ['technicianId'],
      where: {
        date_end: null,
        groupId: groupId
      },
      raw: true
    })

    const technicianIdsInGroup = techniciansInGroup.map((tech) => tech.technicianId)

    const technicians = await Technician.findAll({
      where: {
        id: {
          [Sequelize.Op.in]: technicianIdsInGroup
        }
      }
    })

    res.status(200).json(technicians)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

module.exports = {
  createGroupTechnician,
  deleteGroupTechnician,
  freeTechnicians,
  getTechnicians
}
