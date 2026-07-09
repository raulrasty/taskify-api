import { Express } from 'express';
import request from 'supertest';
import { createApp } from '../../src/app';
import { InMemoryTaskRepository } from '../../src/repositories/inMemoryTaskRepository';

describe('API /api/tasks', () => {
  let app: Express;

  beforeEach(() => {
    const repository = new InMemoryTaskRepository();
    app = createApp(repository);
  });

  it('GET /api/tasks devuelve lista vacía al principio', async () => {
    const res = await request(app).get('/api/tasks');
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it('POST /api/tasks crea una tarea y la devuelve con 201', async () => {
    const res = await request(app).post('/api/tasks').send({ title: 'Escribir README' });

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ title: 'Escribir README', status: 'pending' });
    expect(res.body.data.id).toBeDefined();
  });

  it('POST /api/tasks devuelve 400 si falta el título', async () => {
    const res = await request(app).post('/api/tasks').send({});
    expect(res.status).toBe(400);
  });

  it('GET /api/tasks/:id devuelve 404 si no existe', async () => {
    const res = await request(app).get('/api/tasks/no-existe');
    expect(res.status).toBe(404);
  });

  it('flujo completo: crear, leer, actualizar y borrar una tarea', async () => {
    const createRes = await request(app).post('/api/tasks').send({ title: 'Tarea de flujo completo' });
    const id = createRes.body.data.id;

    const getRes = await request(app).get(`/api/tasks/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.title).toBe('Tarea de flujo completo');

    const updateRes = await request(app).put(`/api/tasks/${id}`).send({ status: 'done' });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.status).toBe('done');

    const deleteRes = await request(app).delete(`/api/tasks/${id}`);
    expect(deleteRes.status).toBe(204);

    const getAfterDeleteRes = await request(app).get(`/api/tasks/${id}`);
    expect(getAfterDeleteRes.status).toBe(404);
  });

  it('PUT /api/tasks/:id devuelve 404 al actualizar una tarea inexistente', async () => {
    const res = await request(app).put('/api/tasks/no-existe').send({ status: 'done' });
    expect(res.status).toBe(404);
  });

  it('DELETE /api/tasks/:id devuelve 404 al borrar una tarea inexistente', async () => {
    const res = await request(app).delete('/api/tasks/no-existe');
    expect(res.status).toBe(404);
  });
});