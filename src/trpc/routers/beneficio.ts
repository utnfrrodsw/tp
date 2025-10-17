import { router, publicProcedure } from '../trpc.js';
import { z } from 'zod';
import { ObjectId } from '@mikro-orm/mongodb';
import { Beneficio } from '../../beneficios/beneficios.entity.js';
import { Wallet } from '../../wallet/wallet.entity.js';
import { Rubro } from '../../rubros/rubros.entity.js';
import { Localidad } from '../../localidad/localidad.entity.js';
import { createBeneficioSchema, updateBeneficioSchema, idSchema } from '../schemas.js';

export const beneficioRouter = router({
  // GET all beneficios
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const beneficios = await ctx.em.find(Beneficio, {}, { 
        populate: ['wallet', 'rubro', 'localidades'] 
      });
      return {
        message: 'found all beneficios',
        data: beneficios
      };
    }),

  // GET beneficio by ID
  getById: publicProcedure
    .input(z.object({ id: idSchema }))
    .query(async ({ ctx, input }) => {
      let beneficio;
      try {
        beneficio = await ctx.em.findOneOrFail(Beneficio, { id: input.id }, { 
          populate: ['wallet', 'rubro', 'localidades'] 
        });
      } catch (e) {
        try {
          beneficio = await ctx.em.findOneOrFail(Beneficio, { _id: new ObjectId(input.id) }, { 
            populate: ['wallet', 'rubro', 'localidades'] 
          });
        } catch (err) {
          throw new Error('Beneficio not found');
        }
      }
      return {
        message: 'found beneficio',
        data: beneficio
      };
    }),

  // POST create beneficio
  create: publicProcedure
    .input(createBeneficioSchema)
    .mutation(async ({ ctx, input }) => {
      const { walletId, rubroId, localidades: localidadIds, ...beneficioData } = input;
      
      // Find wallet
      let wallet;
      try {
        wallet = await ctx.em.findOneOrFail(Wallet, { id: walletId });
      } catch (e) {
        try {
          wallet = await ctx.em.findOneOrFail(Wallet, { _id: new ObjectId(walletId) });
        } catch (err) {
          throw new Error('Wallet not found');
        }
      }
      
      // Find rubro
      let rubro;
      try {
        rubro = await ctx.em.findOneOrFail(Rubro, { id: rubroId });
      } catch (e) {
        try {
          rubro = await ctx.em.findOneOrFail(Rubro, { _id: new ObjectId(rubroId) });
        } catch (err) {
          throw new Error('Rubro not found');
        }
      }
      
      // Create beneficio
      const beneficio = ctx.em.create(Beneficio, {
        ...beneficioData,
        wallet,
        rubro
      });
      
      // Handle localidades if provided
      if (localidadIds && localidadIds.length > 0) {
        for (const localidadId of localidadIds) {
          let localidad;
          try {
            localidad = await ctx.em.findOneOrFail(Localidad, { id: localidadId });
          } catch (e) {
            try {
              localidad = await ctx.em.findOneOrFail(Localidad, { _id: new ObjectId(localidadId) });
            } catch (err) {
              throw new Error(`Localidad ${localidadId} not found`);
            }
          }
          beneficio.localidades.add(localidad);
        }
      }
      
      await ctx.em.flush();
      
      // Reload with populated relations
      const savedBeneficio = await ctx.em.findOneOrFail(Beneficio, { _id: beneficio._id }, { 
        populate: ['wallet', 'rubro', 'localidades'] 
      });
      
      return {
        message: 'beneficio created',
        data: savedBeneficio
      };
    }),

  // PUT update beneficio
  update: publicProcedure
    .input(z.object({
      id: idSchema,
      data: updateBeneficioSchema
    }))
    .mutation(async ({ ctx, input }) => {
      const { walletId, rubroId, localidades: localidadIds, ...beneficioData } = input.data;
      
      // Find beneficio
      let beneficio;
      try {
        beneficio = await ctx.em.findOneOrFail(Beneficio, { id: input.id }, { 
          populate: ['wallet', 'rubro', 'localidades'] 
        });
      } catch (e) {
        try {
          beneficio = await ctx.em.findOneOrFail(Beneficio, { _id: new ObjectId(input.id) }, { 
            populate: ['wallet', 'rubro', 'localidades'] 
          });
        } catch (err) {
          throw new Error('Beneficio not found');
        }
      }
      
      // Update basic data
      ctx.em.assign(beneficio, beneficioData);
      
      // Update wallet if provided
      if (walletId) {
        let wallet;
        try {
          wallet = await ctx.em.findOneOrFail(Wallet, { id: walletId });
        } catch (e) {
          try {
            wallet = await ctx.em.findOneOrFail(Wallet, { _id: new ObjectId(walletId) });
          } catch (err) {
            throw new Error('Wallet not found');
          }
        }
        beneficio.wallet = wallet;
      }
      
      // Update rubro if provided
      if (rubroId) {
        let rubro;
        try {
          rubro = await ctx.em.findOneOrFail(Rubro, { id: rubroId });
        } catch (e) {
          try {
            rubro = await ctx.em.findOneOrFail(Rubro, { _id: new ObjectId(rubroId) });
          } catch (err) {
            throw new Error('Rubro not found');
          }
        }
        beneficio.rubro = rubro;
      }
      
      // Update localidades if provided
      if (localidadIds !== undefined) {
        beneficio.localidades.removeAll();
        
        if (localidadIds.length > 0) {
          for (const localidadId of localidadIds) {
            let localidad;
            try {
              localidad = await ctx.em.findOneOrFail(Localidad, { id: localidadId });
            } catch (e) {
              try {
                localidad = await ctx.em.findOneOrFail(Localidad, { _id: new ObjectId(localidadId) });
              } catch (err) {
                throw new Error(`Localidad ${localidadId} not found`);
              }
            }
            beneficio.localidades.add(localidad);
          }
        }
      }
      
      await ctx.em.flush();
      
      // Reload with populated relations
      const updatedBeneficio = await ctx.em.findOneOrFail(Beneficio, { _id: beneficio._id }, { 
        populate: ['wallet', 'rubro', 'localidades'] 
      });
      
      return {
        message: 'beneficio updated',
        data: updatedBeneficio
      };
    }),

  // DELETE beneficio
  delete: publicProcedure
    .input(z.object({ id: idSchema }))
    .mutation(async ({ ctx, input }) => {
      let beneficio;
      try {
        beneficio = await ctx.em.findOneOrFail(Beneficio, { id: input.id });
      } catch (e) {
        try {
          beneficio = await ctx.em.findOneOrFail(Beneficio, { _id: new ObjectId(input.id) });
        } catch (err) {
          throw new Error('Beneficio not found');
        }
      }
      
      await ctx.em.removeAndFlush(beneficio);
      
      return {
        message: 'beneficio deleted'
      };
    }),
});