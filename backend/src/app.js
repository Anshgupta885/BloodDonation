const express = require('express');
const cors = require('cors');

const app=express();

const dotenv = require('dotenv');
dotenv.config();

const DonorRoutes = require('./routes/DonorRoutes');
app.use('/api/donors', DonorRoutes);
const AdminRoutes = require('./routes/AdminRoutes');
app.use('/api/admins', AdminRoutes);
const HospitalRoutes = require('./routes/HospitalRoutes');
app.use('/api/hospitals', HospitalRoutes);

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
module.exports = app;