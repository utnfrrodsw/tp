import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, publicProcedure } from '../trpc.js';
import { persona } from '../../personas/personas.entity.js';
import { createPersonaSchema, updatePersonaSchema, idSchema } from '../schemas.js';
import { ObjectId } from '@mikro-orm/mongodb';
import bcrypt from 'bcryptjs';

// Función utilitaria simplificada basada en el controlador
async function findByIdOrObjectId(em: any, id: string) {
  try {
    return await em.findOneOrFail(persona, { id }, { populate: ['wallets', 'localidad', 'notificaciones'] });
  } catch (e) {
    return await em.findOneOrFail(persona, { _id: new ObjectId(id) }, { populate: ['wallets', 'localidad', 'notificaciones'] });
  }
}

export const personaRouter = router({
  // GET todas las personas - igual al controlador findAll
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const personas = await ctx.em.find(persona, {}, { populate: ['wallets', 'localidad', 'notificaciones'] });
        return {
          message: 'found all personas',
          data: personas
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message
        });
      }
    }),

  // GET persona por ID - igual al controlador findOne
  getById: publicProcedure
    .input(z.object({ id: idSchema }))
    .query(async ({ input, ctx }) => {
      try {
        const personaFound = await findByIdOrObjectId(ctx.em, input.id);
        return {
          message: 'found persona',
          data: personaFound
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Persona not found'
        });
      }
    }),

  // POST crear persona - igual al controlador add con conversión de tipos
  create: publicProcedure
    .input(createPersonaSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        // Hash del password
        const hashedPassword = await bcrypt.hash(input.password, 10);
        
        // Preparar datos como en el controlador con conversión de tipos
        const personaData: any = {
          name: input.name,
          apellido: input.apellido,
          password: hashedPassword,
          email: input.email,
          tel: parseInt(input.tel), // Convertir string a number
          dni: input.dni,
          direccion: input.direccion,
        };

        // Agregar localidad si existe
        if (input.localidadId) {
          personaData.localidad = new ObjectId(input.localidadId);
        }

        // Agregar wallets si existen
        if (input.wallets && input.wallets.length > 0) {
          personaData.wallets = input.wallets.map((id: string) => new ObjectId(id));
        }
        
        const personaCreated = ctx.em.create(persona, personaData);
        await ctx.em.flush();
        
        // Remover password de la respuesta
        const { password, ...personaWithoutPassword } = personaCreated;
        
        return {
          message: 'persona created',
          data: personaWithoutPassword
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message
        });
      }
    }),

  // PUT actualizar persona - igual al controlador update
  update: publicProcedure
    .input(z.object({ 
      id: idSchema, 
      data: updatePersonaSchema 
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const personaToUpdate = await findByIdOrObjectId(ctx.em, input.id);
        
        // Convertir tipos si están presentes
        const updateData: any = { ...input.data };
        
        // Convertir tel a number si existe
        if (updateData.tel) {
          updateData.tel = parseInt(updateData.tel);
        }
        
        // Hash password si se está actualizando
        if (updateData.password) {
          updateData.password = await bcrypt.hash(updateData.password, 10);
        }
        
        // Convertir localidadId a ObjectId si existe
        if (updateData.localidadId) {
          updateData.localidad = new ObjectId(updateData.localidadId);
          delete updateData.localidadId;
        }
        
        // Convertir wallets a ObjectId array si existen
        if (updateData.wallets && updateData.wallets.length > 0) {
          updateData.wallets = updateData.wallets.map((id: string) => new ObjectId(id));
        }
        
        ctx.em.assign(personaToUpdate, updateData);
        await ctx.em.flush();
        
        // Remover password de la respuesta
        const { password, ...personaWithoutPassword } = personaToUpdate;
        
        return {
          message: 'persona updated',
          data: personaWithoutPassword
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Persona not found'
        });
      }
    }),

  // DELETE persona - igual al controlador remove
  delete: publicProcedure
    .input(z.object({ id: idSchema }))
    .mutation(async ({ ctx, input }) => {
      try {
        const personaToRemove = await findByIdOrObjectId(ctx.em, input.id);
        await ctx.em.removeAndFlush(personaToRemove);
        return {
          message: 'persona deleted',
          data: { id: input.id }
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Persona not found'
        });
      }
    }),

  // LOGIN persona
  login: publicProcedure
    .input(z.object({
      email: z.string().email('Must be a valid email'),
      password: z.string().min(1, 'Password is required')
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        // Buscar persona por email - incluir password explícitamente
        const personaFound = await ctx.em.findOne(persona, { email: input.email }, { 
          populate: ['wallets', 'localidad'],
          fields: ['*', 'password'] // Incluir explícitamente el campo password que está hidden
        });

        if (!personaFound) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Credenciales inválidas'
          });
        }

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(input.password, personaFound.password);
        
        if (!isPasswordValid) {
          throw new TRPCError({
            code: 'UNAUTHORIZED',
            message: 'Credenciales inválidas'
          });
        }

        // Login exitoso - remover password de la respuesta
        const { password: _, ...personaData } = personaFound;
        return {
          message: 'Login exitoso',
          data: personaData
        };

      } catch (error: any) {
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error.message
        });
      }
    }),
});