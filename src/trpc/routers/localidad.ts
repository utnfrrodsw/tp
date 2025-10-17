import { router, publicProcedure } from '../trpc.js';
import { z } from 'zod';
import { ObjectId } from '@mikro-orm/mongodb';
import { Localidad } from '../../localidad/localidad.entity.js';
import { createLocalidadSchema, updateLocalidadSchema, idSchema } from '../schemas.js';

export const localidadRouter = router({
  // GET all localidades
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const localidades = await ctx.em.find(Localidad, {}, { 
        populate: ['ciudades', 'beneficios', 'personas'] 
      });
      return {
        message: 'found all localidades',
        data: localidades
      };
    }),

  // GET localidad by ID
  getById: publicProcedure
    .input(z.object({ id: idSchema }))
    .query(async ({ ctx, input }) => {
      let localidad;
      try {
        localidad = await ctx.em.findOneOrFail(Localidad, { id: input.id }, { 
          populate: ['ciudades', 'beneficios', 'personas'] 
        });
      } catch (e) {
        try {
          localidad = await ctx.em.findOneOrFail(Localidad, { _id: new ObjectId(input.id) }, { 
            populate: ['ciudades', 'beneficios', 'personas'] 
          });
        } catch (err) {
          throw new Error('Localidad not found');
        }
      }
      return {
        message: 'found localidad',
        data: localidad
      };
    }),

  // POST create localidad
  create: publicProcedure
    .input(createLocalidadSchema)
    .mutation(async ({ ctx, input }) => {
      const localidad = ctx.em.create(Localidad, input);
      await ctx.em.flush();
      
      // Reload with populated relations
      const savedLocalidad = await ctx.em.findOneOrFail(Localidad, { _id: localidad._id }, { 
        populate: ['ciudades', 'beneficios', 'personas'] 
      });
      
      return {
        message: 'localidad created',
        data: savedLocalidad
      };
    }),

  // PUT update localidad
  update: publicProcedure
    .input(z.object({
      id: idSchema,
      data: updateLocalidadSchema
    }))
    .mutation(async ({ ctx, input }) => {
      // Find localidad
      let localidad;
      try {
        localidad = await ctx.em.findOneOrFail(Localidad, { id: input.id }, { 
          populate: ['ciudades', 'beneficios', 'personas'] 
        });
      } catch (e) {
        try {
          localidad = await ctx.em.findOneOrFail(Localidad, { _id: new ObjectId(input.id) }, { 
            populate: ['ciudades', 'beneficios', 'personas'] 
          });
        } catch (err) {
          throw new Error('Localidad not found');
        }
      }
      
      // Update data
      ctx.em.assign(localidad, input.data);
      await ctx.em.flush();
      
      // Reload with populated relations
      const updatedLocalidad = await ctx.em.findOneOrFail(Localidad, { _id: localidad._id }, { 
        populate: ['ciudades', 'beneficios', 'personas'] 
      });
      
      return {
        message: 'localidad updated',
        data: updatedLocalidad
      };
    }),

  // DELETE localidad
  delete: publicProcedure
    .input(z.object({ id: idSchema }))
    .mutation(async ({ ctx, input }) => {
      let localidad;
      try {
        localidad = await ctx.em.findOneOrFail(Localidad, { id: input.id });
      } catch (e) {
        try {
          localidad = await ctx.em.findOneOrFail(Localidad, { _id: new ObjectId(input.id) });
        } catch (err) {
          throw new Error('Localidad not found');
        }
      }
      
      await ctx.em.removeAndFlush(localidad);
      
      return {
        message: 'localidad deleted'
      };
    }),
});