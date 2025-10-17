import { router, publicProcedure } from '../trpc.js';
import { z } from 'zod';
import { ObjectId } from '@mikro-orm/mongodb';
import { Wallet } from '../../wallet/wallet.entity.js';
import { persona } from '../../personas/personas.entity.js';
import { createWalletSchema, updateWalletSchema, idSchema } from '../schemas.js';

export const walletRouter = router({
  // GET all wallets
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      const wallets = await ctx.em.find(Wallet, {}, { 
        populate: ['personas', 'beneficios', 'notificaciones'] 
      });
      return {
        message: 'found all wallets',
        data: wallets
      };
    }),

  // GET wallet by ID
  getById: publicProcedure
    .input(z.object({ id: idSchema }))
    .query(async ({ ctx, input }) => {
      let wallet;
      try {
        wallet = await ctx.em.findOneOrFail(Wallet, { id: input.id }, { 
          populate: ['personas', 'beneficios', 'notificaciones'] 
        });
      } catch (e) {
        try {
          wallet = await ctx.em.findOneOrFail(Wallet, { _id: new ObjectId(input.id) }, { 
            populate: ['personas', 'beneficios', 'notificaciones'] 
          });
        } catch (err) {
          throw new Error('Wallet not found');
        }
      }
      return {
        message: 'found wallet',
        data: wallet
      };
    }),

  // POST create wallet
  create: publicProcedure
    .input(createWalletSchema)
    .mutation(async ({ ctx, input }) => {
      const { personas: personaIds, ...walletData } = input;
      
      // Create wallet with basic data
      const wallet = ctx.em.create(Wallet, walletData);
      
      // Handle personas if provided
      if (personaIds && personaIds.length > 0) {
        for (const personaId of personaIds) {
          let personaEntity;
          try {
            personaEntity = await ctx.em.findOneOrFail(persona, { id: personaId });
          } catch (e) {
            try {
              personaEntity = await ctx.em.findOneOrFail(persona, { _id: new ObjectId(personaId) });
            } catch (err) {
              throw new Error(`Persona ${personaId} not found`);
            }
          }
          wallet.personas.add(personaEntity);
        }
      }
      
      await ctx.em.flush();
      
      // Reload with populated relations
      const savedWallet = await ctx.em.findOneOrFail(Wallet, { _id: wallet._id }, { 
        populate: ['personas', 'beneficios', 'notificaciones'] 
      });
      
      return {
        message: 'wallet created',
        data: savedWallet
      };
    }),

  // PUT update wallet
  update: publicProcedure
    .input(z.object({
      id: idSchema,
      data: updateWalletSchema
    }))
    .mutation(async ({ ctx, input }) => {
      const { personas: personaIds, ...walletData } = input.data;
      
      // Find wallet
      let wallet;
      try {
        wallet = await ctx.em.findOneOrFail(Wallet, { id: input.id }, { 
          populate: ['personas', 'beneficios', 'notificaciones'] 
        });
      } catch (e) {
        try {
          wallet = await ctx.em.findOneOrFail(Wallet, { _id: new ObjectId(input.id) }, { 
            populate: ['personas', 'beneficios', 'notificaciones'] 
          });
        } catch (err) {
          throw new Error('Wallet not found');
        }
      }
      
      // Update basic data
      ctx.em.assign(wallet, walletData);
      
      // Update personas if provided
      if (personaIds !== undefined) {
        wallet.personas.removeAll();
        
        if (personaIds.length > 0) {
          for (const personaId of personaIds) {
            let personaEntity;
            try {
              personaEntity = await ctx.em.findOneOrFail(persona, { id: personaId });
            } catch (e) {
              try {
                personaEntity = await ctx.em.findOneOrFail(persona, { _id: new ObjectId(personaId) });
              } catch (err) {
                throw new Error(`Persona ${personaId} not found`);
              }
            }
            wallet.personas.add(personaEntity);
          }
        }
      }
      
      await ctx.em.flush();
      
      // Reload with populated relations
      const updatedWallet = await ctx.em.findOneOrFail(Wallet, { _id: wallet._id }, { 
        populate: ['personas', 'beneficios', 'notificaciones'] 
      });
      
      return {
        message: 'wallet updated',
        data: updatedWallet
      };
    }),

  // DELETE wallet
  delete: publicProcedure
    .input(z.object({ id: idSchema }))
    .mutation(async ({ ctx, input }) => {
      let wallet;
      try {
        wallet = await ctx.em.findOneOrFail(Wallet, { id: input.id });
      } catch (e) {
        try {
          wallet = await ctx.em.findOneOrFail(Wallet, { _id: new ObjectId(input.id) });
        } catch (err) {
          throw new Error('Wallet not found');
        }
      }
      
      await ctx.em.removeAndFlush(wallet);
      
      return {
        message: 'wallet deleted'
      };
    }),
});