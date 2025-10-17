import { Router } from 'express';
import { sanitizeNotificacionInput, findAll, findOne, add, update, remove } from './notificacion.controler.js';

export const NotificacionRouter = Router();

NotificacionRouter.get('/', findAll);
NotificacionRouter.get('/:id', findOne);
NotificacionRouter.post('/', sanitizeNotificacionInput, add);
NotificacionRouter.put('/:id', sanitizeNotificacionInput, update);
NotificacionRouter.patch('/:id', sanitizeNotificacionInput, update);
NotificacionRouter.delete('/:id', remove);
