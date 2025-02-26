const Sequelize = require('sequelize')
const { Group, Technician, Task } = require('../sequelize')
const { getPagination, getPaginationData } = require('../helpers/pagination')

const getGroups = async (req, res) => {
  const { page, size, description } = req.query
  const { limit, offset } = getPagination(page, size)
  var condition = description ? { description: { [Sequelize.Op.like]: `%${description}%` } } : null

  Group.findAndCountAll({
    where: condition,
    limit,
    offset,
    include: [
      {
        model: Technician, 
        required: false, 
        through: { attributes: [], where: { date_end: null } } 
      },
      { model: Task }
    ]
  })
  .then(data => {
    const response = getPaginationData(data, page, limit)
    res.send(response)
  })
  .catch(err => {
    res.status(500).send({
      message: 'Some error occurred while retrieving groups.'
    })
  })
}

const getGroup = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const group = await Group.findByPk(id, {
      include: Technician
    })
    res.status(200).json(group)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const updateGroup = async (req, res) => {
  const { id } = req.params
  const { description } = req.body

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const group = await Group.update({
      description
    }, {
      where: { id }
    })
    res.json(group)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const createGroup = async (req, res) => {
  const { description } = req.body

  try {
    const group = await Group.create({
      description
    })
    res.json(group)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const deleteGroup = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const group = await Group.findByPk(id, {
      include: Task
    })
    if (group.tasks.length > 0) {
      res.status(400).send('Ups! Error')
    } else {
      await Group.destroy({
        where: { id }
      })
      res.json(group)
    }
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

module.exports = {
  getGroups,
  getGroup,
  updateGroup,
  createGroup,
  deleteGroup
}
