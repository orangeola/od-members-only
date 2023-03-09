const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true, maxLength: 32, minLength: 3 },
  email: { type: String, required: true, maxLength: 100, minLength: 3 },
  password: { type: String, required: true, maxLength: 100, minLength: 3 },
  membership: { type: Boolean, required: true },
  admin: { type: Boolean }
});

// Export model
module.exports = mongoose.model("User", UserSchema);
