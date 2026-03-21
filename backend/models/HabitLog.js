const mongoose = require("mongoose");

const habitLogSchema = new mongoose.Schema({

  habitId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Habit"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  date: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("HabitLog", habitLogSchema);