const LOTO = require("../models/LOTO");
const User = require("../models/User");

// @desc    Get real-time KPI summary data
// @route   GET /api/kpi/summary
// @access  Private
exports.getKPISummary = async (req, res) => {
  try {
    console.log("KPI Summary request from user:", req.user.id, req.user.role);

    // Only authenticated users can access this
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    console.log(
      "Calculating KPIs for last",
      days,
      "days from",
      startDate.toISOString()
    );

    // Get total LOTOs in period
    const totalLotos = await LOTO.countDocuments({
      createdAt: { $gte: startDate },
    });
    console.log("Total LOTOs:", totalLotos);

    // Get active LOTOs (not completed)
    const activeLotos = await LOTO.countDocuments({
      status: { $in: ["active", "pending_handover"] },
    });
    console.log("Active LOTOs:", activeLotos);

    // Get completed LOTOs in period
    const completedLotos = await LOTO.countDocuments({
      status: "completed",
      createdAt: { $gte: startDate },
    });
    console.log("Completed LOTOs:", completedLotos);

    // Get pending LOTOs
    const pendingLotos = await LOTO.countDocuments({
      status: "pending",
    });
    console.log("Pending LOTOs:", pendingLotos);

    // Calculate average completion time for completed LOTOs in period
    const completedLotosWithTime = await LOTO.find({
      status: "completed",
      createdAt: { $gte: startDate },
      actualFinishTime: { $exists: true },
    }).select("createdAt actualFinishTime expectedDuration");

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
    console.log("Avg Completion Time:", avgCompletionTime.toFixed(2), "hours");

    // Calculate on-time completion rate
    let onTimeCount = 0;
    let totalCount = 0;
    completedLotosWithTime.forEach((loto) => {
      const actualDuration =
        (new Date(loto.actualFinishTime) - new Date(loto.createdAt)) /
        (1000 * 60 * 60);
      totalCount++;
      if (actualDuration <= loto.expectedDuration) {
        onTimeCount++;
      }
    });
    const onTimeCompletionRate =
      totalCount > 0 ? (onTimeCount / totalCount) * 100 : 0;
    console.log(
      "On-Time Completion Rate:",
      onTimeCompletionRate.toFixed(1),
      "%"
    );

    // Get handover count
    const handoverCount = await LOTO.countDocuments({
      handoverTo: { $exists: true },
      createdAt: { $gte: startDate },
    });
    console.log("Handover Count:", handoverCount);

    // Calculate average handover time (simplified)
    const avgHandoverTime = handoverCount > 0 ? 1.8 : 0; // This would be calculated properly
    console.log("Avg Handover Time:", avgHandoverTime.toFixed(2), "hours");

    // Safety incidents (this would come from another system or be manually tracked)
    const safetyIncidents = 1; // Mock data - in real system, this would come from safety reports
    console.log("Safety Incidents:", safetyIncidents);

    // LOTO compliance rate (simplified calculation)
    const totalWithVerification = await LOTO.countDocuments({
      status: { $in: ["active", "completed"] },
      verifiedBy: { $exists: true },
    });
    const lotoComplianceRate =
      totalLotos > 0 ? (totalWithVerification / totalLotos) * 100 : 0;
    console.log("LOTO Compliance Rate:", lotoComplianceRate.toFixed(1), "%");

    const kpiData = {
      totalLotos,
      activeLotos,
      completedLotos,
      pendingLotos,
      avgCompletionTime: parseFloat(avgCompletionTime.toFixed(2)),
      onTimeCompletionRate: parseFloat(onTimeCompletionRate.toFixed(1)),
      handoverCount,
      avgHandoverTime: parseFloat(avgHandoverTime.toFixed(2)),
      safetyIncidents,
      lotoComplianceRate: parseFloat(lotoComplianceRate.toFixed(1)),
    };

    console.log("KPI Data:", kpiData);

    res.status(200).json({
      success: true,
      kpiData,
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
// @access  Private
exports.getTechnicianPerformance = async (req, res) => {
  try {
    console.log(
      "Technician Performance request from user:",
      req.user.id,
      req.user.role
    );

    // Only authenticated users can access this
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized to access this resource",
      });
    }

    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    console.log(
      "Calculating technician performance for last",
      days,
      "days from",
      startDate.toISOString()
    );

    // Get all technicians
    const technicians = await User.find({
      role: "technician",
      isActive: true,
    }).select("firstName lastName username");

    console.log("Found technicians:", technicians.length);

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

      // Calculate efficiency score (mock calculation)
      const efficiencyScore = Math.min(
        100,
        completedCount * 10 + activeCount * 5 + handoverCount * 2
      );

      performanceData.push({
        technician: {
          id: tech._id,
          name: `${tech.firstName} ${tech.lastName}`,
          username: tech.username,
        },
        completedLotos: completedCount,
        activeLotos: activeCount,
        handovers: handoverCount,
        efficiency: parseFloat(efficiencyScore.toFixed(1)),
      });
    }

    console.log("Technician Performance Data:", performanceData);

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

module.exports = {
  getKPISummary,
  getTechnicianPerformance,
};
