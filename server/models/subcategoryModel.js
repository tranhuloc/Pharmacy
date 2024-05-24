const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subcategorySchema = new Schema({
    category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
    subcategory_name: String,
    is_deleted: Boolean,
    created_at: Date,
    updated_at: Date,
});

const Subcategory = mongoose.model('Subcategory', subcategorySchema);
module.exports = Subcategory;
