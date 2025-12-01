import { Router } from 'express';
import { verifyToken } from '../shared/middleware/auth.middleware.js';
import { createAccount, createSplitPayment } from './stripe.controller.js';
import { stripeWebhook, splitPaymentWebhook } from './webhook.js';

export const stripeRouter = Router();

stripeRouter.post('/', verifyToken, createAccount);
stripeRouter.post('/split-payment', verifyToken, createSplitPayment);
stripeRouter.post('/webhook', stripeWebhook);
stripeRouter.post('/webhook/split-payment', splitPaymentWebhook);
