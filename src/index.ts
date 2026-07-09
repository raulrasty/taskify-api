import 'dotenv/config';
import { Pool } from 'pg';
import { createApp } from './app';
import { PostgresTaskRepository } from './repositories/postgresTaskRepository';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const repository = new PostgresTaskRepository(pool);
const app = createApp(repository);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});