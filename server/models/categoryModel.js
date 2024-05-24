const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category_name: String,
    is_deleted: Boolean,
    created_at: Date,
    updated_at: Date,
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
