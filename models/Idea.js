const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    require: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

mongoose.model('ideas', IdeaSchema);
