import { Request, Response, NextFunction } from 'express'
import { Turno } from './turno.entity.js'
import { orm } from '../shared/db/orm.js'
import { Servicio } from '../servicio/servicio.entity.js'
import { Usuario } from '../usuario/usuario.entity.js'


const em = orm.em
function sanitizeTurnoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizeTurnoInput = {
    fecha: req.body.fecha,
    hora: req.body.hora,
    estado: req.body.estado,
    calificacion: req.body.calificacion,
    comentario: req.body.comentario,
    montoFinal: req.body.montoFinal,
    fechaPago: req.body.fechaPago,
    servicio: req.body.servicio,
    usuario: req.body.usuario
  }
  Object.keys(req.body.sanitizeTurnoInput).forEach((key) => {
    if (req.body.sanitizeTurnoInput[key] === undefined) {
      delete req.body.sanitizeTurnoInput[key]
    }
  })
  next()
}

// Find all turns
async function findall(req: Request, res: Response) {
  try {
    const turns = await em.find(
      Turno,
      {},
      { populate: ['usuario', 'servicio'] }
    )
    res.status(200).json({ message: 'found all turns', data: turns })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Find one turn by date and hour
async function findone(req: Request, res: Response) {
  try {
    const { fecha, hora, usuario, servicio } = req.params
    const sanitizedInput = req.body.sanitizeTurnoInput

    const fechaObj = new Date(fecha);
    const usuarioEntity = await em.findOneOrFail(Usuario, Number(usuario));
    const servicioEntity = await em.findOneOrFail(Servicio, Number(servicio));

    const turn = await em.findOne(Turno, { 
      fecha: fechaObj,
      hora,
      usuario: usuarioEntity,
      servicio: servicioEntity
    }, { populate: ['usuario', 'servicio'] });
    if (!turn) {
      return res.status(404).json({ message: 'Turn not found' })
    }
    res.status(200).json({ message: 'found turn', data: turn })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


// Create a new turn
async function add(req: Request, res: Response) {
  try {
    const sanitizedInput = req.body.sanitizeTurnoInput
    const newTurn = em.create(Turno, sanitizedInput)
    await em.persistAndFlush(newTurn)
    res.status(201).json({ message: 'Turn created successfully', data: newTurn })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Update an existing turn
async function update(req: Request, res: Response) {
  try {
    const { fecha, hora, usuario, servicio } = req.params
    const sanitizedInput = req.body.sanitizeTurnoInput

    const fechaObj = new Date(fecha);
    const usuarioEntity = await em.findOneOrFail(Usuario, Number(usuario));
    const servicioEntity = await em.findOneOrFail(Servicio, Number(servicio));

    const turn = await em.findOne(Turno, { 
      fecha: fechaObj,
      hora,
      usuario: usuarioEntity,
      servicio: servicioEntity
    }, { populate: ['usuario', 'servicio'] });

    if (!turn) {
      return res.status(404).json({ message: 'Turn not found' })
    }
    em.assign(turn, sanitizedInput)
    await em.persistAndFlush(turn)
    res.status(200).json({ message: 'Turn updated successfully', data: turn })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Delete a turn
async function remove(req: Request, res: Response) {
  try {
    const { fecha, hora, usuario, servicio } = req.params
    const sanitizedInput = req.body.sanitizeTurnoInput

    const fechaObj = new Date(fecha);
    const usuarioEntity = await em.findOneOrFail(Usuario, Number(usuario));
    const servicioEntity = await em.findOneOrFail(Servicio, Number(servicio));

    const turn = await em.findOne(Turno, { 
      fecha: fechaObj,
      hora,
      usuario: usuarioEntity,
      servicio: servicioEntity
    }, { populate: ['usuario', 'servicio'] });
    if (!turn) {
      return res.status(404).json({ message: 'Turn not found' })
    }
    await em.removeAndFlush(turn)
    res.status(200).json({ message: 'Turn deleted successfully' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
export {
  sanitizeTurnoInput,
  findall,
  findone,
  add,
  update,
  remove
}