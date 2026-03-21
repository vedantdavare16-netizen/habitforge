const mongoose = require("mongoose");

const habitSchema = new mongoose.Schema({
  name: String,
  frequency: String,
  color: String,
  icon: String,

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  currentStreak: {
    type: Number,
    default: 0
  },

  longestStreak: {
    type: Number,
    default: 0
  },

  lastCompletedDate: {
    type: Date
  }
 
});

module.exports = mongoose.model("Habit", habitSchema);