const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { applicationValidation, updateApplicationValidation, validate } = require('../middleware/validators');
const {
  getApplications, getApplication,
  createApplication, updateApplication, deleteApplication
} = require('../controllers/applicationController');

router.use(protect);

router.get('/',       getApplications);
router.get('/:id',    getApplication);
router.post('/',      applicationValidation,       validate, createApplication);
router.put('/:id',    updateApplicationValidation,  validate, updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;