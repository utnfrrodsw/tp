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
    const groupTechnician = await GroupTechnician.destroy({
      where: {
        groupId,
        technicianId
      }
    })
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
    console.log(freeTechniciansDetails)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

module.exports = {
  createGroupTechnician,
  deleteGroupTechnician,
  freeTechnicians
}
