const express = require("express");
const { getTechnicians } = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/technicians").get(protect, getTechnicians);

module.exports = router;
