const LOTO = require("../models/LOTO");
const User = require("../models/User");

// @desc    Get KPI summary data
// @route   GET /api/kpi/summary
// @access  Private (Manager/Admin)
exports.getKPISummary = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get total LOTOs in period
    const totalLotos = await LOTO.countDocuments({
      createdAt: { $gte: startDate },
    });

    // Get active LOTOs
    const activeLotos = await LOTO.countDocuments({
      status: { $in: ["active", "pending_handover"] },
    });

    // Get completed LOTOs in period
    const completedLotos = await LOTO.countDocuments({
      status: "completed",
      createdAt: { $gte: startDate },
    });

    // Get pending LOTOs
    const pendingLotos = await LOTO.countDocuments({
      status: "pending",
    });

    // Calculate average completion time
    const completedLotosWithTime = await LOTO.find({
      status: "completed",
      createdAt: { $gte: startDate },
      actualFinishTime: { $exists: true },
    });

    let avgCompletionTime = 0;
    if (completedLotosWithTime.length > 0) {
      const totalCompletionTime = completedLotosWithTime.reduce(
        (total, loto) => {
          const duration =
            (new Date(loto.actualFinishTime) - new Date(loto.createdAt)) /
            (1000 * 60 * 60); // in hours
          return total + duration;
        },
        0
      );
      avgCompletionTime = totalCompletionTime / completedLotosWithTime.length;
    }

    // Calculate on-time completion rate (assuming expected duration)
    let onTimeCount = 0;
    completedLotosWithTime.forEach((loto) => {
      const actualDuration =
        (new Date(loto.actualFinishTime) - new Date(loto.createdAt)) /
        (1000 * 60 * 60);
      if (actualDuration <= loto.expectedDuration) {
        onTimeCount++;
      }
    });
    const onTimeCompletionRate =
      completedLotosWithTime.length > 0
        ? (onTimeCount / completedLotosWithTime.length) * 100
        : 0;

    // Get handover count
    const handoverCount = await LOTO.countDocuments({
      handoverTo: { $exists: true },
      createdAt: { $gte: startDate },
    });

    // Calculate average handover time (simplified)
    const avgHandoverTime = handoverCount > 0 ? 1.8 : 0; // This would be calculated properly

    // Safety incidents (this would come from another system or be manually tracked)
    const safetyIncidents = 1; // Mock data

    // LOTO compliance rate (simplified calculation)
    const totalWithVerification = await LOTO.countDocuments({
      status: { $in: ["active", "completed"] },
      verifiedBy: { $exists: true },
    });
    const lotoComplianceRate =
      totalLotos > 0 ? (totalWithVerification / totalLotos) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalLotos,
        activeLotos,
        completedLotos,
        pendingLotos,
        avgCompletionTime: parseFloat(avgCompletionTime.toFixed(1)),
        onTimeCompletionRate: parseFloat(onTimeCompletionRate.toFixed(1)),
        handoverCount,
        avgHandoverTime: parseFloat(avgHandoverTime.toFixed(1)),
        safetyIncidents,
        lotoComplianceRate: parseFloat(lotoComplianceRate.toFixed(1)),
      },
    });
  } catch (error) {
    console.error("KPI summary error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// @desc    Get technician performance data
// @route   GET /api/kpi/technicians
// @access  Private (Manager/Admin)
exports.getTechnicianPerformance = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Get all technicians
    const technicians = await User.find({ role: "technician" }).select(
      "firstName lastName username"
    );

    // Get performance data for each technician
    const performanceData = [];
    for (const tech of technicians) {
      const completedCount = await LOTO.countDocuments({
        isolator: tech._id,
        status: "completed",
        createdAt: { $gte: startDate },
      });

      const activeCount = await LOTO.countDocuments({
        isolator: tech._id,
        status: { $in: ["active", "pending_handover"] },
      });

      const handoverCount = await LOTO.countDocuments({
        isolator: tech._id,
        handoverTo: { $exists: true },
        createdAt: { $gte: startDate },
      });

      performanceData.push({
        technician: {
          id: tech._id,
          name: `${tech.firstName} ${tech.lastName}`,
          username: tech.username,
        },
        completedLotos: completedCount,
        activeLotos: activeCount,
        handovers: handoverCount,
        efficiency: completedCount > 0 ? Math.min(100, completedCount * 10) : 0, // Mock efficiency score
      });
    }

    res.status(200).json({
      success: true,
      count: performanceData.length,
      performanceData,
    });
  } catch (error) {
    console.error("Technician performance error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
