import { Request, Response, NextFunction } from 'express';
import { Appointment } from './appointment.entity.js';
import { AppointmentRepository } from './appointment.repository.js';

const respository = new AppointmentRepository();
