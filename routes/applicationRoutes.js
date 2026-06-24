const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  getApplications, getApplication,
  createApplication, updateApplication, deleteApplication
} = require('../controllers/applicationController');

// This one line protects ALL routes below it
router.use(protect);

router.get('/',       getApplications);
router.get('/:id',    getApplication);
router.post('/',      createApplication);
router.put('/:id',    updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;