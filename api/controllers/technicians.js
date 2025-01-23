const Sequelize = require('sequelize')
const { Group, Technician, Task } = require('../sequelize')
const { getPagination, getPaginationData } = require('../helpers/pagination')

const getTechnicians = async (req, res) => {
  const { page, size, name } = req.query
  const { limit, offset } = getPagination(page, size)
  var condition = name ? { name: { [Sequelize.Op.like]: `%${name}%` } } : null

  Technician.findAndCountAll({
    where: condition,
    limit,
    offset,
    include: Group
  })
  .then(data => {
    const response = getPaginationData(data, page, limit)
    res.send(response)
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving technicians.'
    })
  })
}

const getTechnician = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const technician = await Technician.findByPk(id, {
      include: Group
    })
    res.status(200).json(technician)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const updateTechnician = async (req, res) => {
  const { name, dateBorn } = req.body
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const technician = await Technician.update({
      name,
      date_born: dateBorn
    }, {
      where: { id }
    })
    res.json(technician)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const createTechnician = async (req, res) => {
  const { name, date_born } = req.body
  try {
    const technician = await Technician.create({
      name,
      date_born: date_born
    })
    res.json(technician)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const deleteTechnician = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const technician = await Technician.findByPk(id, {
      include: {
        model: Group,
        include: Task
      }
    })
    if (technician.groups.some(group => group.tasks.length > 0)) {
      return res.status(400).send('Ups! Error')
    } else {
      await Technician.destroy({ where: { id } })
      res.json(technician)
    }
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

module.exports = {
  getTechnicians,
  getTechnician,
  updateTechnician,
  createTechnician,
  deleteTechnician
}
