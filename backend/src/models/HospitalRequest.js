const mongoose = require('mongoose');

const HospitalRequestSchema = new mongoose.Schema({
    bloodGroup: { type: String, required: true },
    units: { type: Number, required: true },
    urgency: { type: String, required: true },
    patientName: { type: String, required: true },
    city: { type: String, required: true },
    byDate: { type: Date, required: true },
    purpose: { type: String, required: true },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
});
 
const HospitalRequest = mongoose.model('HospitalRequest', HospitalRequestSchema);
module.exports = HospitalRequest;