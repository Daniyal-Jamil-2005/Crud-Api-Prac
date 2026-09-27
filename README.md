# Task API (Express)

Simple in-memory CRUD Task API using Express and Swagger UI.

Quick start

1. Install dependencies:

```bash
npm install
```

2. Start server:

```bash
npm start
```

3. Visit:
- API root: http://localhost:3000/
- Health: http://localhost:3000/health
- Swagger UI: http://localhost:3000/docs

Endpoints

- `GET /` — API info
- `GET /health` — health check
- `GET /tasks` — list tasks (query: `done=true|false`, `search=...`)
- `GET /tasks/{id}` — single task (404 if missing)
- `POST /tasks` — create `{ "title": "..." }` (returns 201)
- `PUT /tasks/{id}` — update `{ "title": "...", "done": true }` (400/404)
- `DELETE /tasks/{id}` — delete (204)
- `POST /reset` — restore seed tasks

Example curl (create + get):

```bash
curl -i -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Buy milk"}'

# response includes 201 and the created task
curl -i http://localhost:3000/tasks
```

Notes

- Data is stored in-memory and resets when the server restarts. Use `POST /reset` to restore the original seed while the server runs.
- Swagger UI at `/docs` is interactive — use "Try it out" to exercise the API.

Repository

Push your commits to your GitHub repo. Example commands:

```bash
git init
git add .
git commit -m "Stage 0: hello server"
git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```
