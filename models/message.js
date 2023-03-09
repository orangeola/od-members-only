const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: { type: String, required: true, maxLength: 300 },
  time_stamp: { type: Date },
  author: { type: Schema.Types.ObjectId },
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
