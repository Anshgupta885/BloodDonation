const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.DB_CONNECTION_STRING)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const DonorSchema = new mongoose.Schema({
    FullName: { type: String, required: true },
    BloodGroup: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    password: { type: String, required: true },
 });

 module.exports = mongoose.model('Donor', DonorSchema);
