const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isBlocked: { type: Boolean, default: false },
}); 

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;