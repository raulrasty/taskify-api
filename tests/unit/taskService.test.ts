import { NotFoundError, ValidationError } from '../../src/errors/AppError';
import { InMemoryTaskRepository } from '../../src/repositories/inMemoryTaskRepository';
import { TaskService } from '../../src/services/taskService';

describe('TaskService', () => {
  let repository: InMemoryTaskRepository;
  let service: TaskService;

  beforeEach(() => {
    repository = new InMemoryTaskRepository();
    service = new TaskService(repository);
  });

  describe('createTask', () => {
    it('crea una tarea válida con estado "pending" por defecto', async () => {
      const task = await service.createTask({ title: 'Comprar leche' });

      expect(task.title).toBe('Comprar leche');
      expect(task.status).toBe('pending');
      expect(task.id).toBeDefined();
    });

    it('lanza ValidationError si el título está vacío', async () => {
      await expect(service.createTask({ title: '' })).rejects.toThrow(ValidationError);
    });
  });

  describe('getTask', () => {
    it('devuelve la tarea si existe', async () => {
      const created = await service.createTask({ title: 'Tarea existente' });
      const found = await service.getTask(created.id);
      expect(found.id).toBe(created.id);
    });

    it('lanza NotFoundError si no existe', async () => {
      await expect(service.getTask('id-inexistente')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateTask', () => {
    it('actualiza el estado de una tarea existente', async () => {
      const created = await service.createTask({ title: 'Original' });
      const updated = await service.updateTask(created.id, { status: 'done' });

      expect(updated.status).toBe('done');
      expect(updated.title).toBe('Original');
    });

    it('lanza NotFoundError al actualizar una tarea inexistente', async () => {
      await expect(service.updateTask('no-existe', { status: 'done' })).rejects.toThrow(
        NotFoundError
      );
    });

    it('rechaza una actualización sin ningún campo', async () => {
      const created = await service.createTask({ title: 'Original' });
      await expect(service.updateTask(created.id, {})).rejects.toThrow(ValidationError);
    });
  });

  describe('deleteTask', () => {
    it('elimina una tarea existente', async () => {
      const created = await service.createTask({ title: 'Para borrar' });
      await service.deleteTask(created.id);
      await expect(service.getTask(created.id)).rejects.toThrow(NotFoundError);
    });

    it('lanza NotFoundError al borrar una tarea inexistente', async () => {
      await expect(service.deleteTask('no-existe')).rejects.toThrow(NotFoundError);
    });
  });
});