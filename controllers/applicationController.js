const Application = require('../models/Application');
const AppError = require('../utils/AppError');

const getApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ user: req.user._id });
    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) { next(err); }
};

const getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return next(new AppError('Application not found', 404));
    if (application.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to access this application', 403));
    }
    res.status(200).json({ success: true, data: application });
  } catch (err) { next(err); }
};

const createApplication = async (req, res, next) => {
  try {
    const application = await Application.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: application });
  } catch (err) { next(err); }
};

const updateApplication = async (req, res, next) => {
  try {
    let application = await Application.findById(req.params.id);
    if (!application) return next(new AppError('Application not found', 404));
    if (application.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to update this application', 403));
    }
    application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: application });
  } catch (err) { next(err); }
};

const deleteApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) return next(new AppError('Application not found', 404));
    if (application.user.toString() !== req.user._id.toString()) {
      return next(new AppError('Not authorized to delete this application', 403));
    }
    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Application deleted' });
  } catch (err) { next(err); }
};

module.exports = { getApplications, getApplication, createApplication, updateApplication, deleteApplication };