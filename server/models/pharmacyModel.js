const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pharmacySchema = new Schema({
    pharmacy_name: String,
    address: String,
    latitude: Number,
    longitude: Number,
    is_deleted: Boolean,
    created_at: Date,
    updated_at: Date,
}); 

const Pharmacy = mongoose.model('Pharmacy', pharmacySchema);
module.exports = Pharmacy;
