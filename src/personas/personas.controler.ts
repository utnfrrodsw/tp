import { Request, Response ,NextFunction} from 'express'
import { persona } from './personas.entity.js'
import { orm } from '../shared/db/orm.js'
import { ObjectId } from '@mikro-orm/mongodb'
import bcrypt from 'bcryptjs';

const em = orm.em



function sanitizePersonaInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    password: req.body.password, // Lo hashearemos en add/update
    apellido: req.body.apellido,
    email: req.body.email,
    tel: req.body.tel,
    direccion: req.body.direccion,
    wallets: req.body.wallets,
    localidad: req.body.localidad,
    notificaciones: req.body.notificaciones
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })

  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const personas = await em.find(persona, {}, { populate: ['wallets', 'localidad','notificaciones'] })
    
    // Remover password de todas las personas
    const personasWithoutPassword = personas.map(({ password: _, ...persona }) => persona);
    
    res.status(200).json({ message: 'found all personas', data: personasWithoutPassword })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id
    let personaFound
    try {
      personaFound = await em.findOneOrFail(persona, { id }, { populate: ['wallets', 'localidad','notificaciones'] })
    } catch (e) {
      // try by ObjectId in _id
      try {
        personaFound = await em.findOneOrFail(persona, { _id: new ObjectId(id) }, { populate: ['wallets', 'localidad','notificaciones'] })
      } catch (err) {
        throw err
      }
    }
    res.status(200).json({ message: 'found persona', data: personaFound })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    // Verificar si el email ya existe
    const emailExists = await checkEmailExists(req.body.sanitizedInput.email);
    if (emailExists) {
      res.status(400).json({ message: 'the email is already in use by another user' });
      return;
    }

    const input = { ...req.body.sanitizedInput }; // cuerpo de la request

    // Hash del password si está presente
    if (input.password) {
      input.password = await bcrypt.hash(input.password, 10);
    }

    // Convertir IDs de wallets y localidad a ObjectId
    if (input.wallets && Array.isArray(input.wallets)) { // pregunto si existe e es un array
      input.wallets = input.wallets.map((walletId: string) => new ObjectId(walletId)); // lo mapeo a ObjectId
    }
    if (input.localidad) {
      input.localidad = new ObjectId(input.localidad); // mas de lo mismo
    }

    const personaCreated = em.create(persona, input); // creo la persona usando el input modificado y con los strings de 
    // wallets y localidad convertidos a ObjectId porque asi funcionan las relaciones en la base de datos 
    await em.flush(); // vacio el bus

 

    res.status(201).json({ message: 'persona created', data: personaCreated }); // devuelvo la persona con las relaciones pobladas
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = req.params.id
    const input = { ...req.body.sanitizedInput }
    
    // Hash del password si está presente
    if (input.password != undefined) {
      input.password = await bcrypt.hash(input.password, 10);
    }
    
    // Convertir IDs de wallets y localidad a ObjectId
    if (input.wallets && Array.isArray(input.wallets)) {
      input.wallets = input.wallets.map((walletId: string) => new ObjectId(walletId))
    }
    if (input.localidad) {
      input.localidad = new ObjectId(input.localidad)
    }
    
    const personaToUpdate = await em.findOneOrFail(persona, { id })
    em.assign(personaToUpdate, input)
    await em.flush()
    
    // Remover password de la respuesta
    const { password: _, ...personaData } = personaToUpdate;
    
    res
      .status(200)
      .json({ message: 'persona updated', data: personaData })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id
    let personaToRemove
    try {
      personaToRemove = await em.findOneOrFail(persona, { id })
    } catch (e) {
      personaToRemove = await em.findOneOrFail(persona, { _id: new ObjectId(id) })
    }
    await em.removeAndFlush(personaToRemove)
    res.status(200).send({ message: 'persona deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
// Función para verificar si el email ya existe
async function checkEmailExists(email: string): Promise<boolean> {
  const personaFound = await em.findOne(persona, { email });
  return personaFound !== null;
}
export {sanitizePersonaInput, findAll, findOne, add, update, remove }