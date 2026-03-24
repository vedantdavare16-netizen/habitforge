const express = require("express");
const router = express.Router();
const Habit = require("../models/Habit");
const { getHeatmapData } = require("../controllers/habitController");

const authMiddleware = require("../middleware/authMiddleware");

const {
  createHabit,
  getHabits,
  deleteHabit,
  checkInHabit,
  getHabitHistory,
  getLeaderboard,
  completeHabit
} = require("../controllers/habitController");

// ✅ Protected routes
router.get("/", authMiddleware, getHabits);
router.post("/", authMiddleware, createHabit);
router.delete("/:id", authMiddleware, deleteHabit);

// ⚠️ SHOULD ALSO BE PROTECTED
router.post("/:id/checkin", authMiddleware, checkInHabit);
router.get("/:id/history", authMiddleware, getHabitHistory);
router.get("/leaderboard", authMiddleware, getLeaderboard);

// ✅ New route
router.post("/:id/complete", authMiddleware, completeHabit);
router.get("/heatmap", authMiddleware, getHeatmapData);
// ✅ Export CSV (Premium Feature)
router.get("/export", authMiddleware, async (req, res) => {
  try {
    if (!req.user.isPremium) {
      return res.status(403).json({ message: "Premium feature only" });
    }

    

    const habits = await Habit.find({ user: req.userId });

    let csv = "Habit Name,Completed Today\n";

    const today = new Date().toISOString().split("T")[0];

    habits.forEach((h) => {
      const lastDate = h.lastCompletedDate
        ? new Date(h.lastCompletedDate).toISOString().split("T")[0]
        : null;

      const completed = lastDate === today ? 1 : 0;

      csv += `${h.name},${completed}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("habits.csv");
    return res.send(csv);

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;