import { randomUUID } from 'crypto';
import { Task } from '../types/task';
import { CreateTaskInput, TaskRepository, UpdateTaskInput } from './taskRepository';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks: Task[] = [];

  async findAll(): Promise<Task[]> {
    return this.tasks;
  }

  async findById(id: string): Promise<Task | null> {
    return this.tasks.find((t) => t.id === id) ?? null;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const newTask: Task = {
      id: randomUUID(),
      title: input.title,
      status: 'pending',
    };
    this.tasks.push(newTask);
    return newTask;
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task | null> {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return null;

    if (input.title !== undefined) task.title = input.title;
    if (input.status !== undefined) task.status = input.status;

    return task;
  }

  async delete(id: string): Promise<boolean> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }

  // Solo para tests: vacía el repositorio entre casos.
  reset(): void {
    this.tasks = [];
  }
}