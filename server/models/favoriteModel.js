const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  created_at: { type: Date, default: Date.now },
  is_deleted: Boolean,
  created_at: Date,
  updated_at: Date,
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
