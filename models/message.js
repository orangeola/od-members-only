const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: { type: String, required: true, maxLength: 300 },
  time_stamp: { type: Date },
  author: { type: Schema.Types.ObjectId, ref: "User" },
});

MessageSchema.virtual("date_formatted").get(function () {
  return this.time_stamp ? DateTime.fromJSDate(this.time_stamp).toLocaleString(DateTime.now().toFormat('MMMM dd, yyyy')) : '';
});

// Export model
module.exports = mongoose.model("Message", MessageSchema);
