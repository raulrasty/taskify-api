import { NotFoundError } from '../../src/errors/AppError';

describe('NotFoundError', () => {
  it('usa un mensaje por defecto si no se especifica ninguno', () => {
    const error = new NotFoundError();
    expect(error.message).toBe('Recurso no encontrado');
    expect(error.statusCode).toBe(404);
  });
});