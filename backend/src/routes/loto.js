const express = require("express");
const {
  createLOTO,
  getLOTOs,
  getLOTO,
  verifyLOTO,
  updateLOTO,
  completeLOTO,
  handoverLOTO,
  acceptHandover,
} = require("../controllers/lotoController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createLOTO).get(protect, getLOTOs);

router.route("/:id").get(protect, getLOTO).put(protect, updateLOTO);

router.route("/:id/verify").put(protect, verifyLOTO);

router.route("/:id/complete").put(protect, completeLOTO);

router.route("/:id/handover").put(protect, handoverLOTO);

router.route("/:id/accept-handover").put(protect, acceptHandover);

module.exports = router;
