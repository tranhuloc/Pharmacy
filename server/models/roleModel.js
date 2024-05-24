const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  role_name: String,
  is_deleted: Boolean,
  created_at: Date,
  updated_at: Date,
});

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
