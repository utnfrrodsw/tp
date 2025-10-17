import { router, publicProcedure } from '../trpc.js';
import { z } from 'zod';
import { ObjectId } from '@mikro-orm/mongodb';
import { Ciudad } from '../../ciudad/ciudad.entity.js';
import { Localidad } from '../../localidad/localidad.entity.js';
import { createCiudadSchema, updateCiudadSchema, idSchema } from '../schemas.js';

export const ciudadRouter = router({
  // GET all ciudades
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const ciudades = await ctx.em.find(Ciudad, {}, { 
        populate: ['localidad'] 
      });
      return {
        message: 'found all ciudades',
        data: ciudades
      };
    }),

  // GET ciudad by ID
  getById: publicProcedure
    .input(z.object({ id: idSchema }))
    .query(async ({ ctx, input }) => {
      let ciudad;
      try {
        ciudad = await ctx.em.findOneOrFail(Ciudad, { id: input.id }, { 
          populate: ['localidad'] 
        });
      } catch (e) {
        try {
          ciudad = await ctx.em.findOneOrFail(Ciudad, { _id: new ObjectId(input.id) }, { 
            populate: ['localidad'] 
          });
        } catch (err) {
          throw new Error('Ciudad not found');
        }
      }
      return {
        message: 'found ciudad',
        data: ciudad
      };
    }),

  // POST create ciudad
  create: publicProcedure
    .input(createCiudadSchema)
    .mutation(async ({ ctx, input }) => {
      const { localidadId, ...ciudadData } = input;
      
      // Find localidad
      let localidad;
      try {
        localidad = await ctx.em.findOneOrFail(Localidad, { id: localidadId });
      } catch (e) {
        try {
          localidad = await ctx.em.findOneOrFail(Localidad, { _id: new ObjectId(localidadId) });
        } catch (err) {
          throw new Error('Localidad not found');
        }
      }
      
      // Create ciudad
      const ciudad = ctx.em.create(Ciudad, { ...ciudadData, localidad });
      await ctx.em.flush();
      
      // Reload with populated relations
      const savedCiudad = await ctx.em.findOneOrFail(Ciudad, { _id: ciudad._id }, { 
        populate: ['localidad'] 
      });
      
      return {
        message: 'ciudad created',
        data: savedCiudad
      };
    }),

  // PUT update ciudad
  update: publicProcedure
    .input(z.object({
      id: idSchema,
      data: updateCiudadSchema
    }))
    .mutation(async ({ ctx, input }) => {
      const { localidadId, ...ciudadData } = input.data;
      
      // Find ciudad
      let ciudad;
      try {
        ciudad = await ctx.em.findOneOrFail(Ciudad, { id: input.id }, { 
          populate: ['localidad'] 
        });
      } catch (e) {
        try {
          ciudad = await ctx.em.findOneOrFail(Ciudad, { _id: new ObjectId(input.id) }, { 
            populate: ['localidad'] 
          });
        } catch (err) {
          throw new Error('Ciudad not found');
        }
      }
      
      // Update basic data
      ctx.em.assign(ciudad, ciudadData);
      
      // Update localidad if provided
      if (localidadId) {
        let localidad;
        try {
          localidad = await ctx.em.findOneOrFail(Localidad, { id: localidadId });
        } catch (e) {
          try {
            localidad = await ctx.em.findOneOrFail(Localidad, { _id: new ObjectId(localidadId) });
          } catch (err) {
            throw new Error('Localidad not found');
          }
        }
        ciudad.localidad = localidad;
      }
      
      await ctx.em.flush();
      
      // Reload with populated relations
      const updatedCiudad = await ctx.em.findOneOrFail(Ciudad, { _id: ciudad._id }, { 
        populate: ['localidad'] 
      });
      
      return {
        message: 'ciudad updated',
        data: updatedCiudad
      };
    }),

  // DELETE ciudad
  delete: publicProcedure
    .input(z.object({ id: idSchema }))
    .mutation(async ({ ctx, input }) => {
      let ciudad;
      try {
        ciudad = await ctx.em.findOneOrFail(Ciudad, { id: input.id });
      } catch (e) {
        try {
          ciudad = await ctx.em.findOneOrFail(Ciudad, { _id: new ObjectId(input.id) });
        } catch (err) {
          throw new Error('Ciudad not found');
        }
      }
      
      await ctx.em.removeAndFlush(ciudad);
      
      return {
        message: 'ciudad deleted'
      };
    }),
});