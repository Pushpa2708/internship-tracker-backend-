require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const Application = require('./models/Application');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

connectDB();

// GET all applications
app.get('/applications', async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single application by id
app.get('/applications/:id', async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(application);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - create a new application
app.post('/applications', async (req, res) => {
  try {
    const newApplication = await Application.create(req.body);
    res.status(201).json(newApplication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - update an existing application
app.put('/applications/:id', async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - remove an application
app.delete('/applications/:id', async (req, res) => {
  try {
    const deleted = await Application.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.status(200).json({ message: 'Deleted', application: deleted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});