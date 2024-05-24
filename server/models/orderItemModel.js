const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderItemSchema = new Schema({
    order_id: { type: Schema.Types.ObjectId, ref: 'Order' },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product' },
    color: String,
    size: String,
    quantity: Number,
    is_deleted: Boolean,
    created_at: Date,
    updated_at: Date,
});

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItem;
