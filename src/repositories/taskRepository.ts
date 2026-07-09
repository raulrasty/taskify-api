import { Task } from '../types/task';

export interface CreateTaskInput {
  title: string;
}

export interface UpdateTaskInput {
  title?: string;
  status?: Task['status'];
}

// Contrato que debe cumplir cualquier forma de almacenar tareas
export interface TaskRepository {
  findAll(): Promise<Task[]>;
  findById(id: string): Promise<Task | null>;
  create(input: CreateTaskInput): Promise<Task>;
  update(id: string, input: UpdateTaskInput): Promise<Task | null>;
  delete(id: string): Promise<boolean>;
}