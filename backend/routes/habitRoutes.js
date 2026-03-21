const express = require("express");
const router = express.Router();
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

module.exports = router;