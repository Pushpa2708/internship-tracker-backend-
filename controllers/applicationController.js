const Application = require('../models/Application');

const getApplications = async (req, res) => {
  try {
    // Only fetch THIS user's applications
    const applications = await Application.find({ user: req.user._id });
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    // 401 vs 403: 401 = not logged in, 403 = logged in but not allowed
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to access this application' });
    }
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid ID format' });
    res.status(500).json({ success: false, message: err.message });
  }
};

const createApplication = async (req, res) => {
  try {
    // Attach logged-in user's id to the new document
    const application = await Application.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateApplication = async (req, res) => {
  try {
    let application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this application' });
    }
    application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: application });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid ID format' });
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }
    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this application' });
    }
    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Application deleted' });
  } catch (err) {
    if (err.name === 'CastError') return res.status(400).json({ success: false, message: 'Invalid ID format' });
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getApplications, getApplication, createApplication, updateApplication, deleteApplication };