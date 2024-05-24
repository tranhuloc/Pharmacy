const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  created_at: { type: Date, default: Date.now },
  is_deleted: Boolean,
  created_at: Date,
  updated_at: Date,
});

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;
