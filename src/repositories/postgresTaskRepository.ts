import { Pool } from 'pg';
import { Task } from '../types/task';
import { CreateTaskInput, TaskRepository, UpdateTaskInput } from './taskRepository';

// Así llegan las filas "en crudo" desde Postgres (nombres de columna en snake_case)
interface TaskRow {
  id: string;
  title: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

// Convierte una fila de Postgres a nuestro tipo Task (camelCase, tal como
// lo usa el resto de la aplicación)
function toTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    status: row.status as Task['status'],
  };
}

export class PostgresTaskRepository implements TaskRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Task[]> {
    const result = await this.pool.query<TaskRow>('SELECT * FROM tasks ORDER BY created_at DESC');
    return result.rows.map(toTask);
  }

  async findById(id: string): Promise<Task | null> {
    const result = await this.pool.query<TaskRow>('SELECT * FROM tasks WHERE id = $1', [id]);
    return result.rows[0] ? toTask(result.rows[0]) : null;
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const result = await this.pool.query<TaskRow>(
      'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
      [input.title]
    );
    return toTask(result.rows[0]);
  }

  async update(id: string, input: UpdateTaskInput): Promise<Task | null> {
    const existing = await this.findById(id);
    if (!existing) return null;

    const merged = {
      title: input.title ?? existing.title,
      status: input.status ?? existing.status,
    };

    const result = await this.pool.query<TaskRow>(
      `UPDATE tasks SET title = $1, status = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [merged.title, merged.status, id]
    );
    return result.rows[0] ? toTask(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}