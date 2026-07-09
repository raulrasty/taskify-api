# Taskify API

![CI](https://github.com/raulrasty/taskify-api/actions/workflows/ci.yml/badge.svg)


API REST de gestión de tareas construida con **TypeScript, Express y PostgreSQL**.

Proyecto de portfolio centrado deliberadamente en buenas prácticas de
ingeniería (testing, contenedores y CI/CD), como complemento a mis otros
proyectos más orientados a producto:
[Rasty](https://github.com/raulrasty/Rasty),
[DentalRaúl](https://github.com/raulrasty/dentalraul) y
[PokéRasty](https://github.com/raulrasty/Pokerasty-).

## Características

- CRUD completo de tareas (crear, listar, obtener, actualizar, eliminar)
- Validación de datos con [Zod](https://zod.dev) en cada endpoint de escritura
- Arquitectura en capas con inyección de dependencias: el repositorio de
  datos es intercambiable entre una implementación en memoria (tests) y
  PostgreSQL (producción), sin tocar la lógica de negocio
- 17 tests (unitarios + integración con Supertest), ~97% de cobertura
- Dockerfile multi-stage + docker-compose (API + Postgres)
- Pipeline de CI en GitHub Actions: lint → tests con cobertura → build



## Stack tecnológico

| Capa            | Tecnología                  |
|-----------------|------------------------------|
| Lenguaje        | TypeScript 5                |
| Framework HTTP  | Express 4                   |
| Validación      | Zod                          |
| Base de datos   | PostgreSQL 16                |
| Testing         | Jest + Supertest              |
| Contenedores    | Docker + docker-compose       |
| CI/CD           | GitHub Actions                |

## Endpoints

| Método | Ruta              | Descripción              |
|--------|-------------------|----------------------------|
| GET    | `/api/tasks`      | Listar todas las tareas    |
| GET    | `/api/tasks/:id`  | Obtener una tarea por id   |
| POST   | `/api/tasks`      | Crear una tarea            |
| PUT    | `/api/tasks/:id`  | Actualizar una tarea       |
| DELETE | `/api/tasks/:id`  | Eliminar una tarea         |

**Ejemplo de creación:**

​```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Escribir README"}'
​```


## Instalación y uso

### Requisitos

- Node.js 20+ (si quieres correrlo sin Docker)
- Docker y Docker Compose

### Con Docker (recomendado, incluye Postgres)

​```bash
git clone https://github.com/raulrasty/taskify-api.git
cd taskify-api
docker compose up --build
​```

La API queda disponible en `http://localhost:3000`.

### En local sin Docker

​```bash
git clone https://github.com/raulrasty/taskify-api.git
cd taskify-api
npm install
cp .env.example .env
npm run dev
​```

Necesitas una instancia de PostgreSQL accesible y su `DATABASE_URL`
correspondiente en tu `.env`.


## Testing

​```bash
npm test              # ejecuta los tests
npm run test:coverage # tests + reporte de cobertura
​```

## CI/CD

Cada push a `main` dispara un pipeline en GitHub Actions
(`.github/workflows/ci.yml`) que ejecuta: instalación de dependencias →
lint → tests con cobertura → build de producción.