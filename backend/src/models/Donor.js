const mongoose = require('mongoose');

const DonorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bloodGroup: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    password: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
    profilePicture: { type: String, default: null },
 });

 module.exports = mongoose.model('Donor', DonorSchema);
