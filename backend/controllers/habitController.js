const Habit = require("../models/Habit");
const HabitLog = require("../models/HabitLog");
const User = require("../models/User");
const { checkAndAssignBadges } = require("../utils/gamification");



// CREATE HABIT
exports.createHabit = async (req, res) => {
  try {

    const { name, frequency, color, icon } = req.body;

     const userId = req.userId; 

   const habit = new Habit({
  name,
  frequency,
  color,
  icon,
  userId: req.userId 
});

    await habit.save();

    res.json(habit);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// GET ALL HABITS
exports.getHabits = async (req, res) => {
  try {


    const habits = await Habit.find({ userId: req.userId });

    res.json(habits);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// DELETE HABIT
exports.deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    // ensure user owns the habit
    if (habit.userId.toString() !== req.userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await habit.deleteOne();

    res.json({ message: "Habit deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting habit" });
  }
};


// CHECK-IN HABIT
// CHECK-IN HABIT
exports.checkInHabit = async (req, res) => {
  try {

    const habitId = req.params.id;

    const habit = await Habit.findById(habitId);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    today.setHours(0,0,0,0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    // prevent duplicate completion
    const existingLog = await HabitLog.findOne({
      habitId,
      date: today
    });

    if (existingLog) {
      return res.json({
        message: "Habit already completed today"
      });
    }

    // SAVE COMPLETION LOG
    await HabitLog.create({
      habitId: habit._id,
      userId: habit.userId,
      date: today,
      completed: true
    });

    // STREAK CALCULATION
    if (habit.lastCompletedDate) {

      const last = new Date(habit.lastCompletedDate);
      last.setHours(0,0,0,0);

      if (last.getTime() === yesterday.getTime()) {
        habit.currentStreak += 1;
      } else {
        habit.currentStreak = 1;
      }

    } else {
      habit.currentStreak = 1;
    }

    // LONGEST STREAK
    if (habit.currentStreak > habit.longestStreak) {
      habit.longestStreak = habit.currentStreak;
    }

    habit.lastCompletedDate = today;

    await habit.save();


    // GET USER
    const user = await User.findById(habit.userId);

    // XP SYSTEM
    let xpReward = 10;

    if (habit.currentStreak === 3) xpReward += 5;
    if (habit.currentStreak === 7) xpReward += 10;
    if (habit.currentStreak === 30) xpReward += 50;

    user.xp += xpReward;

    user.level = Math.floor(Math.sqrt(user.xp));


    // BADGE SYSTEM
    if (habit.currentStreak === 3 && !user.badges.includes("Beginner")) {
      user.badges.push("Beginner");
    }

    if (habit.currentStreak === 7 && !user.badges.includes("Consistent")) {
      user.badges.push("Consistent");
    }

    if (habit.currentStreak === 30 && !user.badges.includes("Master")) {
      user.badges.push("Master");
    }

    // LEGEND BADGE (100 completions)
    const totalCompletions = await HabitLog.countDocuments({
      userId: user._id
    });

    if (totalCompletions >= 100 && !user.badges.includes("Legend")) {
      user.badges.push("Legend");
    }

    await user.save();


    res.json({
      message: "Habit completed successfully",
      streak: habit.currentStreak,
      longestStreak: habit.longestStreak,
      xp: user.xp,
      level: user.level,
      badges: user.badges
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// GET HABIT HISTORY
exports.getHabitHistory = async (req, res) => {
  try {

    const habitId = req.params.id;

    const logs = await HabitLog.find({
      habitId: habitId
    }).sort({ date: 1 });

    res.json({
      habitId: habitId,
      totalCompletions: logs.length,
      history: logs
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// LEADERBOARD
exports.getLeaderboard = async (req, res) => {
  try {

    const users = await User.find()
      .sort({ xp: -1 })   // highest XP first
      .limit(10)          // top 10 users
      .select("name xp level badges");

    res.json({
      leaderboard: users
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.completeHabit = async (req, res) => {
  try {
    const habitId = req.params.id;

    const habit = await Habit.findById(habitId);

    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    const today = new Date();
    const todayDate = new Date(today.toDateString());

    const lastCompleted = habit.lastCompletedDate;

    if (!lastCompleted) {
      habit.currentStreak = 1;
    } else {
      const lastDate = new Date(lastCompleted.toDateString());

      const diffTime = todayDate - lastDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 0) {
        return res.status(400).json({ message: "Already completed today" });
      } else if (diffDays === 1) {
        habit.currentStreak += 1;
      } else {
        habit.currentStreak = 1;
      }
    }

    // 🔥 Longest streak
    if (habit.currentStreak > habit.longestStreak) {
      habit.longestStreak = habit.currentStreak;
    }

    habit.lastCompletedDate = today;

    await habit.save();
    await HabitLog.create({
  habitId: habit._id,
  userId: habit.userId,
  date: new Date()
});
console.log("🔥 HabitLog created");

    // 🔥 GET USER
    const user = await User.findById(habit.userId);

    // ⭐ XP SYSTEM
    user.xp += 10;

    // 🎮 LEVEL SYSTEM (better version)
    user.level = Math.floor(Math.sqrt(user.xp));

    // 🏆 BADGE SYSTEM (NEW CLEAN WAY)
    const newBadges = checkAndAssignBadges(user, habit);

    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
    }
     console.log("New badges:", newBadges);

    await user.save();

    res.json({
      message: "Habit completed",
      habit,
      xp: user.xp,
      level: user.level,
      badges: user.badges
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
  
};
exports.getHeatmapData = async (req, res) => {
  try {
    const userId = req.userId;

    // Last 365 days
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - 365);

    // Fetch logs
    const logs = await HabitLog.find({
      userId,
      date: { $gte: pastDate }
    });

    // Count per day
    const map = {};

    logs.forEach(log => {
      const date = log.date.toLocaleDateString("en-CA");

      if (!map[date]) {
        map[date] = 0;
      }
      map[date]++;
    });

    // Fill all dates (important)
    const result = [];

    for (let i = 0; i < 365; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);

      const formatted = d.toLocaleDateString("en-CA");

      result.push({
        date: formatted,
        count: map[formatted] || 0
      });
    }

    res.json(result.reverse());

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching heatmap" });
  }
};