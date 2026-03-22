const mongoose = require('mongoose');

const RequesterSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, min: 18, max: 100 },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String },
    roleAlias: { type: String, enum: ['recipient', 'patient'], default: 'recipient' },
    isBlocked: { type: Boolean, default: false },
    address: { type: String, required: true },
    passwordHash: { type: String, required: true },
});

module.exports = mongoose.model('Requester', RequesterSchema);