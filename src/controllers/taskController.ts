import { NextFunction, Request, Response } from 'express';
import { TaskService } from '../services/taskService';

interface TaskParams {
  id: string;
}

export class TaskController {
  constructor(private readonly service: TaskService) {}

  // Usamos "arrow functions" (=>) en vez de métodos normales aquí.
  // Motivo: cuando Express llama a estas funciones como callback de una ruta,
  // pierde la referencia a "this" si son métodos normales. Las arrow functions
  // capturan automáticamente el "this" de la clase, evitando ese problema.

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tasks = await this.service.listTasks();
      res.status(200).json({ data: tasks });
    } catch (err) {
      next(err);
    }
  };

  getById = async (req: Request<TaskParams>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const task = await this.service.getTask(req.params.id);
      res.status(200).json({ data: task });
    } catch (err) {
      next(err);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const newTask = await this.service.createTask(req.body);
      res.status(201).json({ data: newTask });
    } catch (err) {
      next(err);
    }
  };

  update = async (req: Request<TaskParams>, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updated = await this.service.updateTask(req.params.id, req.body);
      res.status(200).json({ data: updated });
    } catch (err) {
      next(err);
    }
  };

  delete = async (req: Request<TaskParams>, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.service.deleteTask(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}