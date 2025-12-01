import { Request, Response, NextFunction } from 'express';
import { Tarea } from './tarea.entity.js';
import { orm } from '../shared/db/orm.js';

const em = orm.em;

async function findall(req: Request, res: Response) {
  try {
    const tasks = await em.find(Tarea, {}, { populate: ['servicios'] });
    res.status(200).json({ message: 'found all tasks', data: tasks });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findone(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const task = await em.findOneOrFail(
      Tarea,
      { id },
      { populate: ['servicios'] }
    );
    res.status(200).json({ message: 'found one task', data: task });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const tasks = em.create(Tarea, req.body);
    await em.persistAndFlush(tasks);
    res.status(201).json({ message: 'created task', data: tasks });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const task = await em.findOneOrFail(Tarea, { id });
    em.assign(task, req.body);
    await em.flush();
    res.status(200).json({ message: 'updated task', data: task });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const task = await em.findOneOrFail(Tarea, { id });
    await em.removeAndFlush(task);
    res.status(200).json({ message: 'deleted task', data: task });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}
export { findall, findone, add, update, remove };
