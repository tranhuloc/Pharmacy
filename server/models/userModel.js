const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstname: String,
  lastname: String,
  username: String,
  password: String,
  phone: String,
  email: String,
  address: String,
  role_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Role",
  },
  is_deleted: Boolean,
  created_at: Date,
  updated_at: Date,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
