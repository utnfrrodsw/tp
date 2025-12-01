import { Request, Response, NextFunction } from 'express';
import { Zona } from './zona.entity.js';
import { orm } from '../shared/db/orm.js';
import { getOauth } from '../usuario/usuario.controler.js';
import { populate } from 'dotenv';
const em = orm.em;

interface AuthRequest extends Request {
  user?: {
    id: string;
    rol: string;
    email: string;
  };
}
async function findAll(req: Request, res: Response) {
  try {
    const zona = await em.find(Zona, {}, { populate: ['usuarios'] });

    res.status(200).json({
      message: 'found all Zonas',
      data: zona,
    });
  } catch (error: any) {
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const { id } = req.params; // Already validated as string that matches /^\d+$/
    const codZona = Number.parseInt(id);

    const zona = await em.findOneOrFail(
      Zona,
      { id: codZona },
      { populate: ['usuarios'] }
    );

    res.status(200).json({
      message: 'found one zona',
      data: zona,
    });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'Zona no encontrada',
      });
    }
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

async function add(req: Request, res: Response) {
  try {
    const zonaData = req.body; // Already validated by createZonaValidation schema

    // Check if zona with same descripcionZona already exists
    const existingZona = await em.findOne(Zona, {
      descripcionZona: zonaData.descripcionZona,
    });

    if (existingZona) {
      return res.status(409).json({
        error: 'ZONA_ALREADY_EXISTS',
        message: 'Ya existe una zona con esa descripción',
      });
    }

    const zona = em.create(Zona, zonaData);
    await em.flush();

    res.status(201).json({
      message: 'Zona creada exitosamente',
      data: zona,
    });
  } catch (error: any) {
    console.error('Error creating zona:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

async function update(req: Request, res: Response) {
  try {
    const { id } = req.params; // Already validated
    const updateData = req.body; // Already validated by updateZonaValidation schema
    const codZona = Number.parseInt(id);

    const zonaToUpdate = await em.findOneOrFail(Zona, { id: codZona });

    // Check if another zona with the same descripcionZona exists (only if changing descripcionZona)
    if (
      updateData.descripcionZona &&
      zonaToUpdate.descripcionZona !== updateData.descripcionZona
    ) {
      const existingZona = await em.findOne(Zona, {
        descripcionZona: updateData.descripcionZona,
      });

      if (existingZona) {
        return res.status(409).json({
          error: 'DESCRIPCION_ALREADY_EXISTS',
          message: 'Ya existe una zona con esa descripción',
        });
      }
    }

    em.assign(zonaToUpdate, updateData);
    await em.flush();

    res.status(200).json({
      message: 'updated zona',
      data: zonaToUpdate,
    });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'Zona no encontrada',
      });
    }

    console.error('Error updating zona:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const { id } = req.params; // Already validated
    const codZona = Number.parseInt(id);

    const zona = await em.findOneOrFail(
      Zona,
      { id: codZona },
      { populate: ['usuarios'] }
    );

    // Check if zona has associated users before deleting
    if (zona.usuarios && zona.usuarios.length > 0) {
      return res.status(409).json({
        error: 'ZONA_HAS_USERS',
        message: 'No se puede eliminar la zona porque tiene usuarios asociados',
      });
    }

    await em.removeAndFlush(zona);

    res.status(200).json({
      message: 'deleted zona',
      data: zona,
    });
  } catch (error: any) {
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'Zona no encontrada',
      });
    }

    console.error('Error deleting zona:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}
async function findAllPerUser(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }
    const allZonas = await em.find(Zona, {}, { populate: ['usuarios'] });

    const userZonas = await em.find(Zona, { usuarios: { id: Number(userId) } });

    const zonas = [];
    for (const z of allZonas) {
      if (z.id === userZonas.find((uz) => uz.id === z.id)?.id) {
        zonas.push({
          id: z.id,
          descripcionZona: z.descripcionZona,
          selected: true,
        });
      } else {
        zonas.push({
          id: z.id,
          descripcionZona: z.descripcionZona,
          selected: false,
        });
      }
    }

    res.status(200).json({
      message: 'Zonas encontradas',
      data: zonas,
    });
  } catch (error: any) {
    console.error('Error fetching zonas for user:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}
// si el etado es true significa que ya estaba seleccionado y hay que sacarlo
async function updateByUser(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const { id } = req.params;
    const estado = req.body.estado;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: User ID missing' });
    }
    const user = await getOauth(Number(userId));

    // Busco la zona una sola vez
    const zona = await em.findOneOrFail(
      Zona,
      { id: Number(id) },
      { populate: ['usuarios'] }
    );

    if (estado) {
      // estaba seleccionado => remover
      zona.usuarios.remove(user);
      await em.flush();
      return res.status(200).json({
        message: 'Zona removida del usuario',
        data: {
          id: zona.id,
          descripcionZona: zona.descripcionZona,
          selected: false,
        },
      });
    } else {
      // no estaba seleccionado => agregar
      zona.usuarios.add(user);
      await em.flush();
      return res.status(200).json({
        message: 'Zona agregada al usuario',
        data: {
          id: zona.id,
          descripcionZona: zona.descripcionZona,
          selected: true,
        },
      });
    }
  } catch (error: any) {
    if (error?.name === 'NotFoundError') {
      return res.status(404).json({
        message: 'Usuario o zona no encontrada',
      });
    }
    console.error('Error updating zona for user:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message,
    });
  }
}

export { findAll, findOne, add, update, remove, findAllPerUser, updateByUser };
