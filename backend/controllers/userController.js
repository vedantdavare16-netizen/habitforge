const User = require("../models/User");
const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");

exports.getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalHabits = await Habit.countDocuments({
      userId: req.userId
    });

    const totalCompletions = await HabitLog.countDocuments({
      userId: req.userId
    });

    res.json({
      name: user.name,
      xp: user.xp || 0,
      level: user.level || 1,
      badges: user.badges || [],
      totalHabits,
      totalCompletions
    });

  } catch (error) {
    console.log("PROFILE ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};