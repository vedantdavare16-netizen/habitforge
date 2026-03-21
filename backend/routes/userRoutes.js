const express = require("express");
const router = express.Router();

const { getUserProfile } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User"); // ✅ added

router.get("/profile", authMiddleware, getUserProfile);

// 🏆 Leaderboard Route (added)
router.get("/leaderboard", async (req, res) => {
  try {
    const users = await User.find()
      .select("name xp")
      .sort({ xp: -1 })
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});

module.exports = router;