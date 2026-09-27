const express = require('express');
const swaggerUi = require('swagger-ui-express');
const openapi = require('./openapi.json');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const initialTasks = [
  { id: 1, title: 'Buy groceries', done: false },
  { id: 2, title: 'Write report', done: true },
  { id: 3, title: 'Call Alice', done: false }
];

let tasks = initialTasks.map(t => ({ ...t }));

// Stage 1: root and health
app.get('/', (req, res) => {
  res.json({ name: 'Task API', version: '1.0', endpoints: ['/tasks'] });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Stage 2: read
app.get('/tasks', (req, res) => {
  const { done, search } = req.query;
  let result = tasks;
  if (typeof done !== 'undefined') {
    const d = done === 'true';
    result = result.filter(t => t.done === d);
  }
  if (typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(t => t.title.toLowerCase().includes(q));
  }
  res.json(result);
});

app.get('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: `Task ${id} not found` });
  res.json(task);
});

// Stage 3: create
app.post('/tasks', (req, res) => {
  const { title } = req.body || {};
  if (!title || String(title).trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  const nextId = tasks.length ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = { id: nextId, title: String(title).trim(), done: false };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Stage 4: update
app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find(t => t.id === id);
  if (!task) return res.status(404).json({ error: `Task ${id} not found` });
  const body = req.body || {};
  if (Object.keys(body).length === 0) {
    return res.status(400).json({ error: 'Empty body' });
  }
  if ('title' in body) {
    if (!body.title || String(body.title).trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    task.title = String(body.title).trim();
  }
  if ('done' in body) {
    if (typeof body.done !== 'boolean') {
      return res.status(400).json({ error: 'Done must be a boolean' });
    }
    task.done = body.done;
  }
  res.json(task);
});

// delete
app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex(t => t.id === id);
  if (idx === -1) return res.status(404).json({ error: `Task ${id} not found` });
  tasks.splice(idx, 1);
  res.status(204).send();
});

// Extras: reset
app.post('/reset', (req, res) => {
  tasks = initialTasks.map(t => ({ ...t }));
  res.json({ reset: true, tasks });
});

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapi));

app.listen(PORT, () => {
  console.log(`Task API listening on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/docs`);
});
