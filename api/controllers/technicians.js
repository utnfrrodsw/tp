const { Group, Technician } = require('../sequelize')

const getTechnicians = (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);

  Technician.findAndCountAll({
    limit,
    offset,
    include: {
      model: Group
    }
  })
  .then(data => {
    const response = getPagingData(data, page, limit);
    res.send(response);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving tutorials."
    });
  });
}

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: technicians } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, technicians, totalPages, currentPage };
};

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

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
