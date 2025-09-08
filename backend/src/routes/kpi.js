const express = require('express');
const {
  getKPISummary,
  getTechnicianPerformance
} = require('../controllers/kpiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Protect all routes
router.use(protect);

router.route('/summary')
  .get(getKPISummary);

router.route('/technicians')
  .get(getTechnicianPerformance);

module.exports = router;
