const Application = require('../models/Application');

// GET all applications
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find();
    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET one application by id
const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid application ID format' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST - create new application
const createApplication = async (req, res) => {
  try {
    const application = await Application.create(req.body);
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT - update application
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid application ID format' });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE - delete application
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    res.status(200).json({ success: true, message: 'Application deleted', data: application });
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(400).json({ success: false, message: 'Invalid application ID format' });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication
};