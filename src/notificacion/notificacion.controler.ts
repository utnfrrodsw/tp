import { Request, Response, NextFunction } from 'express';
import { Notificacion } from './notificacion.entity.js';
import { persona } from '../personas/personas.entity.js';
import { Wallet } from '../wallet/wallet.entity.js';
import { orm } from '../shared/db/orm.js';
import { ObjectId } from '@mikro-orm/mongodb';

const em = orm.em;

function sanitizeNotificacionInput(req: Request, _res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    min_descuento: req.body.min_descuento,
    tipos_beneficio: req.body.tipos_beneficio,
    medio_envio: req.body.medio_envio,
    activo: req.body.activo,
    fecha_ultima_notificacion: req.body.fecha_ultima_notificacion,
    persona: req.body.persona,
    wallets: req.body.wallets || req.body.walletIds || req.body.wallet
  };

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });

  next();
}

async function findAll(_req: Request, res: Response) {
  try {
        const notificaciones = await em.find(Notificacion, {}, { populate: ['persona', 'wallets'] });
        // Asegurar que las colecciones estén inicializadas antes de serializar
        for (const n of notificaciones) {
          if (!n.wallets.isInitialized()) {
            await n.wallets.init();
          }
        }
    res.status(200).json({ message: 'found all notificaciones', data: notificaciones });
  } catch (error: any) {
    console.error('findAll notificaciones error', error);
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = req.params.id;
    let notificacionFound;
    try {
      notificacionFound = await em.findOneOrFail(Notificacion, { id }, { populate: ['persona', 'wallets'] });
    } catch (e) {
      notificacionFound = await em.findOneOrFail(Notificacion, { _id: new ObjectId(id) }, { populate: ['persona', 'wallets'] });
    }
    // Inicializar colecciones para evitar errores de serialización
    if (!notificacionFound.wallets.isInitialized()) {
      await notificacionFound.wallets.init();
    }
    res.status(200).json({ message: 'found notificacion', data: notificacionFound });
  } catch (error: any) {
    console.error('findOne notificacion error', error);
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response): Promise<void> {
  try {
    // Validar que la persona existe
    if (req.body.sanitizedInput.persona) {
      let personaEntity;
      try {
        personaEntity = await em.findOne(persona, { id: req.body.sanitizedInput.persona });
      } catch (e) {
        console.log('Search by id failed:', (e as Error).message);
        // Si falla por id string, intentar por ObjectId
      }
      
      if (!personaEntity) {
        try {
          personaEntity = await em.findOne(persona, { _id: new ObjectId(req.body.sanitizedInput.persona) });
          console.log('Search by _id result:', personaEntity ? 'Found' : 'Not found');
        } catch (e) {
          console.log('Search by _id failed:', (e as Error).message);
          // Si falla convertir a ObjectId, mantener personaEntity como null
        }
      }
      
      if (!personaEntity) {
        console.log('Final result: Persona not found');
        res.status(400).json({ message: 'Persona not found' });
        return;
      }
      req.body.sanitizedInput.persona = personaEntity;
    }

    // Validar y cargar wallets
    const walletsEntities = [];
    if (req.body.sanitizedInput.wallets && Array.isArray(req.body.sanitizedInput.wallets)) {
      for (const walletId of req.body.sanitizedInput.wallets) {
        let walletEntity;
        try {
          walletEntity = await em.findOne(Wallet, { id: walletId });
        } catch (e) {
          walletEntity = await em.findOne(Wallet, { _id: new ObjectId(walletId) });
        }
        
        if (walletEntity) {
          walletsEntities.push(walletEntity);
        }
      }
    }

    // Crear la notificación sin las billeteras primero
    const notificacionData = { ...req.body.sanitizedInput };
  delete notificacionData.wallets; // Eliminar billeteras para asignarlas después
    
    const notificacionCreated = em.create(Notificacion, notificacionData);
    
    // Agregar las billeteras a la colección después de crear la entidad
    if (walletsEntities.length > 0) {
      walletsEntities.forEach(wallet => notificacionCreated.wallets.add(wallet));
    }
    
    await em.flush();
    
    // Recargar con relaciones pobladas
    const notificacionWithRelations = await em.findOne(Notificacion, { _id: notificacionCreated._id }, {
      populate: ['persona', 'wallets']
    });
    
    res.status(201).json({ message: 'notificacion created', data: notificacionWithRelations });
  } catch (error: any) {
    console.error('add notificacion error', error);
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id;
    let notificacionToUpdate;
    try {
      notificacionToUpdate = await em.findOneOrFail(Notificacion, { id }, { populate: ['persona', 'wallets'] });
    } catch (e) {
      notificacionToUpdate = await em.findOneOrFail(Notificacion, { _id: new ObjectId(id) }, { populate: ['persona', 'wallets'] });
    }

    // Validar y actualizar persona si se proporciona
    if (req.body.sanitizedInput.persona) {
      let personaEntity;
      try {
        personaEntity = await em.findOne(persona, { id: req.body.sanitizedInput.persona });
      } catch (e) {
        // Si falla por id string, intentar por ObjectId
      }
      
      if (!personaEntity) {
        try {
          personaEntity = await em.findOne(persona, { _id: new ObjectId(req.body.sanitizedInput.persona) });
        } catch (e) {
          // Si falla convertir a ObjectId, mantener personaEntity como null
        }
      }
      
      if (!personaEntity) {
        res.status(400).json({ message: 'Persona not found' });
        return;
      }
      req.body.sanitizedInput.persona = personaEntity;
    }

    em.assign(notificacionToUpdate, req.body.sanitizedInput);
    await em.flush();
    
    // Recargar con relaciones pobladas
    const notificacionUpdated = await em.findOne(Notificacion, { _id: notificacionToUpdate._id }, {
      populate: ['persona', 'wallets']
    });
    
    res.status(200).json({ message: 'notificacion updated', data: notificacionUpdated });
  } catch (error: any) {
    console.error('update notificacion error', error);
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = req.params.id;
    let notificacionToDelete;
    try {
      notificacionToDelete = await em.findOneOrFail(Notificacion, { id });
    } catch (e) {
      notificacionToDelete = await em.findOneOrFail(Notificacion, { _id: new ObjectId(id) });
    }
    
    await em.removeAndFlush(notificacionToDelete);
    res.status(200).json({ message: 'notificacion deleted' });
  } catch (error: any) {
    console.error('remove notificacion error', error);
    res.status(500).json({ message: error.message });
  }
}

export { sanitizeNotificacionInput, findAll, findOne, add, update, remove };