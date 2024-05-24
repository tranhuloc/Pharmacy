const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    subcategory_id: { type: Schema.Types.ObjectId, ref: 'Subcategory' },
    supplier_id: { type: Schema.Types.ObjectId, ref: 'Supplier' },
    pharmacy_id: { type: Schema.Types.ObjectId, ref: 'Pharmacy' },
    product_name: String,
    trademark: String,
    price: Number,
    description: String,
    active_ingredient: String, //hoạt chất
    indications: String, //chỉ định
    dosage_form: String, //dạng bào chế
    manufacturer: String, //nơi sản xuất
    packaging: String, //quy cách
    note: String, //Lưu ý
    url_image: String,
    stock_quantity: Number,
    is_deleted: Boolean,
    created_at: Date,
    updated_at: Date,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
