const Sequelize = require('sequelize')
const { Op } = require('sequelize');
const { Group, Task, Price, sequelize } = require('../sequelize')
const { getPagination, getPaginationData } = require('../helpers/pagination')

const getTasks = async (req, res) => {
  const { page, size, name } = req.query
  const { limit, offset } = getPagination(page, size)
  var condition = name ? { name: { [Sequelize.Op.like]: `%${name}%` } } : null
  
  Task.findAndCountAll({
    where: condition,
    limit,
    offset,
    include: [
      { model: Group },
      { model: Price}
    ]
  })
  .then(data => {
    const response = getPaginationData(data, page, limit)
    res.send(response)
  })
  .catch(err => {
    res.status(500).send({
      message: err.message || 'Some error occurred while retrieving tasks.'
    })
  })
}

const getTask = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const task = await Task.findByPk(id, {
      include: [{
        model: Group
      }, {
        model: Price
      }]
    })
    res.status(200).json(task)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const updateTask = async (req, res) => {
  const { name, price } = req.body
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const task = await Task.update({
      name
    }, {
      where: { id }
    })
    const priceTask = await Price.create({
      taskId: id,
      price
    })
    res.json(task)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const createTask = async (req, res) => {
  const { name, price } = req.body

  try {
    const task = await Task.create({
      name
    })
    const priceTask = await Price.create({
      taskId: task.id,
      price
    })
    res.json(task)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const deleteTask = async (req, res) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send('Ups! Error')
  }

  try {
    const task = await Task.destroy({ where: { id } })
    res.json(task)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}

const sumTasks = async (req, res) => {
  try {
    const tasks = await sequelize.query(`
    SELECT t.name, SUM(gt.quantity) AS total
    FROM 
      tasks t
    INNER JOIN 
      groups_tasks gt ON gt.taskId = t.id
    WHERE 
      gt.date_completed >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
    GROUP BY 
      t.name
    `)

    res.status(200).json(tasks)
  } catch (error) {
    console.log(error)
    res.status(400).send('Ups! Error')
  }
}
const ActualTaskPrice = async (req, res) => {
  try {
    // Eliminar tabla temporal si existe
    await sequelize.query(`
      DROP TEMPORARY TABLE IF EXISTS fecha;
    `);

    // Crear una tabla temporal para almacenar el ID de la tarea y su fecha de precio más reciente
    await sequelize.query(`
      CREATE TEMPORARY TABLE fecha AS
      SELECT id, MAX(createdAt) AS fecha
      FROM prices
      GROUP BY id;
    `);

    // Obtener los nombres de las tareas y sus precios más recientes
    const tasks = await sequelize.query(`
      SELECT t.name, p.price
      FROM tasks t
      INNER JOIN fecha f ON t.id = f.id
      INNER JOIN prices p ON f.id = p.id AND f.fecha = p.createdAt;
    `);

    res.status(200).json(tasks[0]); // Devolver el resultado de la consulta como JSON
  } catch (error) {
    console.error(error);
    res.status(400).send('¡Ups! Ha ocurrido un error');
  }
};

module.exports = {
  getTasks,
  getTask,
  updateTask,
  createTask,
  deleteTask,
  sumTasks,
  ActualTaskPrice
}
