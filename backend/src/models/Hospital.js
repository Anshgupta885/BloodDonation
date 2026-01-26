const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));
 
const HospitalSchema = new mongoose.Schema({
    HospitalName: { type: String, required: true },
    City: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
 });    
 
const Hospital = mongoose.model('Hospital', HospitalSchema);
module.exports = Hospital;