import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'El título es obligatorio').max(200),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(200).optional(),
    status: z.enum(['pending', 'in_progress', 'done']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Debes indicar al menos un campo para actualizar',
  });