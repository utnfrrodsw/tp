import { router, publicProcedure } from '../trpc.js';
import { z } from 'zod';
import { ObjectId } from '@mikro-orm/mongodb';
import { Rubro } from '../../rubros/rubros.entity.js';
import { createRubroSchema, updateRubroSchema, idSchema } from '../schemas.js';

export const rubroRouter = router({
  // GET all rubros
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const rubros = await ctx.em.find(Rubro, {}, { 
        populate: ['beneficios'] 
      });
      return {
        message: 'found all rubros',
        data: rubros
      };
    }),

  // GET rubro by ID
  getById: publicProcedure
    .input(z.object({ id: idSchema }))
    .query(async ({ ctx, input }) => {
      let rubro;
      try {
        rubro = await ctx.em.findOneOrFail(Rubro, { id: input.id }, { 
          populate: ['beneficios'] 
        });
      } catch (e) {
        try {
          rubro = await ctx.em.findOneOrFail(Rubro, { _id: new ObjectId(input.id) }, { 
            populate: ['beneficios'] 
          });
        } catch (err) {
          throw new Error('Rubro not found');
        }
      }
      return {
        message: 'found rubro',
        data: rubro
      };
    }),

  // POST create rubro
  create: publicProcedure
    .input(createRubroSchema)
    .mutation(async ({ ctx, input }) => {
      const rubro = ctx.em.create(Rubro, input);
      await ctx.em.flush();
      
      // Reload with populated relations
      const savedRubro = await ctx.em.findOneOrFail(Rubro, { _id: rubro._id }, { 
        populate: ['beneficios'] 
      });
      
      return {
        message: 'rubro created',
        data: savedRubro
      };
    }),

  // PUT update rubro
  update: publicProcedure
    .input(z.object({
      id: idSchema,
      data: updateRubroSchema
    }))
    .mutation(async ({ ctx, input }) => {
      // Find rubro
      let rubro;
      try {
        rubro = await ctx.em.findOneOrFail(Rubro, { id: input.id }, { 
          populate: ['beneficios'] 
        });
      } catch (e) {
        try {
          rubro = await ctx.em.findOneOrFail(Rubro, { _id: new ObjectId(input.id) }, { 
            populate: ['beneficios'] 
          });
        } catch (err) {
          throw new Error('Rubro not found');
        }
      }
      
      // Update data
      ctx.em.assign(rubro, input.data);
      await ctx.em.flush();
      
      // Reload with populated relations
      const updatedRubro = await ctx.em.findOneOrFail(Rubro, { _id: rubro._id }, { 
        populate: ['beneficios'] 
      });
      
      return {
        message: 'rubro updated',
        data: updatedRubro
      };
    }),

  // DELETE rubro
  delete: publicProcedure
    .input(z.object({ id: idSchema }))
    .mutation(async ({ ctx, input }) => {
      let rubro;
      try {
        rubro = await ctx.em.findOneOrFail(Rubro, { id: input.id });
      } catch (e) {
        try {
          rubro = await ctx.em.findOneOrFail(Rubro, { _id: new ObjectId(input.id) });
        } catch (err) {
          throw new Error('Rubro not found');
        }
      }
      
      await ctx.em.removeAndFlush(rubro);
      
      return {
        message: 'rubro deleted'
      };
    }),
});