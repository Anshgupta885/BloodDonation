const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    bloodGroup: { type: String, required: true },
    units: { type: Number, required: true },
    urgency: { type: String, required: true },
    patientName: { type: String, required: true },
    city: { type: String, required: true },
    byDate: { type: Date, required: true },
    purpose: { type: String, required: true },
    contactName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital', required: true },
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'Donor' },
    status: { type: String, enum: ['pending', 'fulfilled'], default: 'pending' },
 }, { timestamps: true });
 
const Request = mongoose.model('Request', RequestSchema);
module.exports = Request;