const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Game = new Schema({
  name: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
});

mongoose.model("games", Game);
