import { NotFoundError, ValidationError } from '../errors/AppError';
import { TaskRepository } from '../repositories/taskRepository';
import { Task } from '../types/task';
import { createTaskSchema, updateTaskSchema } from '../validation/taskSchemas';

export class TaskService {
  // El "private readonly" aquí crea automáticamente una propiedad de la clase
  // llamada "repository" y la asigna, sin tener que escribirlo aparte.
  constructor(private readonly repository: TaskRepository) {}

  async listTasks(): Promise<Task[]> {
    return this.repository.findAll();
  }

  async getTask(id: string): Promise<Task> {
    const task = await this.repository.findById(id);
    if (!task) {
      throw new NotFoundError(`No existe ninguna tarea con id ${id}`);
    }
    return task;
  }

  async createTask(rawInput: unknown): Promise<Task> {
    const parsed = createTaskSchema.safeParse(rawInput);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));
    }
    return this.repository.create(parsed.data);
  }

  async updateTask(id: string, rawInput: unknown): Promise<Task> {
    const parsed = updateTaskSchema.safeParse(rawInput);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.issues.map((i) => i.message).join(', '));
    }

    const updated = await this.repository.update(id, parsed.data);
    if (!updated) {
      throw new NotFoundError(`No existe ninguna tarea con id ${id}`);
    }
    return updated;
  }

  async deleteTask(id: string): Promise<void> {
    const deleted = await this.repository.delete(id);
    if (!deleted) {
      throw new NotFoundError(`No existe ninguna tarea con id ${id}`);
    }
  }
}