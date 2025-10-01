const express = require("express");
const {
  createLOTO,
  getLOTOs,
  getLOTO,
  verifyLOTO,
  rejectLOTO,
  updateLOTO,
  completeLOTO,
  handoverLOTO,
  acceptHandover,
  rejectHandover,
  changeLOTOStatus,
  getAdminActions,
  addHandover,
  getHandoverHistory,
  deleteLOTO,
} = require("../controllers/lotoController");

const { verifyHandover, recipientDecision } = require("../controllers/handoverVerificationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createLOTO).get(protect, getLOTOs);

router.route("/:id").get(protect, getLOTO).put(protect, updateLOTO);

router.route("/:id/verify").put(protect, verifyLOTO);

router.route("/:id/reject").put(protect, rejectLOTO);

router.route("/:id/complete").put(protect, completeLOTO);

router.route("/:id/handover").put(protect, handoverLOTO);

router.route("/:id/handover").post(protect, addHandover);
router.route("/:id/handover-history").get(protect, getHandoverHistory);

router.route("/:id/handover/:handoverIndex/recipient-decision").put(protect, recipientDecision);

router.route("/:id/handover/:handoverIndex/verify").put(protect, verifyHandover);

router.route("/:id/accept-handover").put(protect, acceptHandover);
router.route("/:id/reject-handover").put(protect, rejectHandover);

router.route("/:id/status").put(protect, changeLOTOStatus);

router.route("/admin-actions").get(protect, getAdminActions);

router.route("/:id").delete(protect, deleteLOTO);

module.exports = router;
