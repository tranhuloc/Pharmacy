const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    image_url: String,
    is_deleted: Boolean,
    created_at: Date,
    updated_at: Date,
});

const Image = mongoose.model('Image', imageSchema);
module.exports = Image;
