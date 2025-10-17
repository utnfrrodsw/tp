import { Router } from 'express';
import { sanitizeWalletInput, findAll, findOne, add, update, remove } from './wallet.controler.js';
import { validatorSchema } from '../middlewares/validator.middleware.js';
import { createWalletSchema, updateWalletSchema } from '../schema/wallet.validator.js';

export const WalletRouter = Router();

WalletRouter.get('/', findAll);
WalletRouter.get('/:id', findOne);
WalletRouter.post('/', validatorSchema(createWalletSchema), sanitizeWalletInput, add);
WalletRouter.put('/:id', validatorSchema(updateWalletSchema), sanitizeWalletInput, update);
WalletRouter.patch('/:id', validatorSchema(updateWalletSchema), sanitizeWalletInput, update);
WalletRouter.delete('/:id', remove);
