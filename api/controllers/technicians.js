const { Group, Technician } = require('../sequelize')

const getTechnicians = async (req, res) => {
  try {
    const technicians = await Technician.findAll({
      include: {
        model: Group
      }
    })
    res.status(200).json(technicians)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
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
    const technician = await Technician.destroy({ where: { id } })
    res.json(technician)
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
