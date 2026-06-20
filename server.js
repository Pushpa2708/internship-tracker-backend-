const express = require('express');
const app = express();
const PORT = 5000;

// ---- MIDDLEWARE ----
app.use(express.json());

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};
app.use(logger);

// ---- DUMMY DATA (in-memory, resets every time server restarts) ----
let applications = [
  { id: 1, company: 'Google', role: 'SDE Intern', status: 'Applied' },
  { id: 2, company: 'Microsoft', role: 'Backend Intern', status: 'Interview' }
];
let nextId = 3;

// ---- ROUTES ----

// GET all applications
app.get('/applications', (req, res) => {
  res.status(200).json(applications);
});

// GET a single application by id
app.get('/applications/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = applications.find(a => a.id === id);
  if (!found) {
    return res.status(404).json({ message: 'Application not found' });
  }
  res.status(200).json(found);
});

// POST - create a new application
app.post('/applications', (req, res) => {
  const { company, role, status } = req.body;

  if (!company || !role) {
    return res.status(400).json({ message: 'company and role are required' });
  }

  const newApplication = {
    id: nextId++,
    company,
    role,
    status: status || 'Applied'
  };

  applications.push(newApplication);
  res.status(201).json(newApplication);
});

// PUT - update an existing application
app.put('/applications/:id', (req, res) => {
  const id = Number(req.params.id);
  const found = applications.find(a => a.id === id);

  if (!found) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const { company, role, status } = req.body;
  if (company !== undefined) found.company = company;
  if (role !== undefined) found.role = role;
  if (status !== undefined) found.status = status;

  res.status(200).json(found);
});

// DELETE - remove an application
app.delete('/applications/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = applications.findIndex(a => a.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const deleted = applications.splice(index, 1);
  res.status(200).json({ message: 'Deleted', application: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});