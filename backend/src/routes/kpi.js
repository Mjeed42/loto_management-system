const express = require("express");
const {
  getKPISummary,
  getTechnicianPerformance,
} = require("../controllers/kpiController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

// Protect all routes
router.use(protect);

// Manager and Admin can access KPIs
router.use(authorize("manager", "admin"));

router.route("/summary").get(getKPISummary);

router.route("/technicians").get(getTechnicianPerformance);

module.exports = router;
