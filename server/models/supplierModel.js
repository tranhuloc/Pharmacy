const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const supplierSchema = new Schema({
    supplier_name: String,
    contact_info: String,
    is_deleted: Boolean,
    created_at: Date,
    updated_at: Date,
});

const Supplier = mongoose.model('Supplier', supplierSchema);
module.exports = Supplier;
