const express = require("express");
const { getTechnicians,getSupervisors  } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/technicians", protect, getTechnicians); // NEW ROUTE
router.get("/supervisors", protect, getSupervisors); // NEW ROUTE

module.exports = router;
