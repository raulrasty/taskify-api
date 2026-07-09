import express, { Express } from "express";
import { TaskController } from "./controllers/taskController";
import { errorHandler } from "./middleware/errorHandler";
import { createTaskRoutes } from "./routes/taskRoutes";
import { TaskService } from "./services/taskService";
import { TaskRepository } from "./repositories/taskRepository";
import swaggerUi from "swagger-ui-express";
import { loadOpenApiSpec } from "./swagger";

export function createApp(repository: TaskRepository): Express {
  const app = express();
  app.use(express.json());

  const service = new TaskService(repository);
  const controller = new TaskController(service);
  const openApiSpec = loadOpenApiSpec();
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

  app.use("/api/tasks", createTaskRoutes(controller));
  app.use(errorHandler);

  return app;
}
