import express, { Express } from 'express';
import { TaskController } from './controllers/taskController';
import { errorHandler } from './middleware/errorHandler';
import { createTaskRoutes } from './routes/taskRoutes';
import { TaskService } from './services/taskService';
import { TaskRepository } from './repositories/taskRepository';

export function createApp(repository: TaskRepository): Express {
  const app = express();
  app.use(express.json());

  const service = new TaskService(repository);
  const controller = new TaskController(service);

  app.use('/api/tasks', createTaskRoutes(controller));
  app.use(errorHandler);

  return app;
}