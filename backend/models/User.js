const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: String,

  email: {
    type: String,
    unique: true
  },

  password: String,

  xp: {
    type: Number,
    default: 0
  },

  level: {
    type: Number,
    default: 1
  },

  badges: {
    type: [String],
    default: []
  },

  isPremium: {
    type: Boolean,
    default: false
  },
  xp: {
  type: Number,
  default: 0
},
level: {
  type: Number,
  default: 1
},
isPremium: {
  type: Boolean,
  default: false
}

});

module.exports = mongoose.model("User", userSchema);