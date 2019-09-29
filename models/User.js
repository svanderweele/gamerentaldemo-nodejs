const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  occupation: {
    type: String,
    required: false
  },
  age: {
    type: Number,
    required: false
  },
  lastLogin: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model("users", UserSchema);
