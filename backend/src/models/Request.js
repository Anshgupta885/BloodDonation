const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    Bloodgroup: { type: String, required: true },
    Units: { type: Number, required: true },
    urgency: { type: String, required: true },
    patientName: { type: String, required: true },
    city: { type: String, required: true },
    byDate: { type: Date, required: true },
    purpose: { type: String, required: true },
    ContactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
 });
 
const Request = mongoose.model('Request', RequestSchema);
module.exports = Request;