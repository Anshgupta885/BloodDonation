const mongoose = require('mongoose');
 
const HospitalSchema = new mongoose.Schema({
    HospitalName: { type: String, required: true },
    City: { type: String, required: true },
    pincode: { type: String },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
 });    
 
const Hospital = mongoose.model('Hospital', HospitalSchema);
module.exports = Hospital;