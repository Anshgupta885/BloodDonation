const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app=express();

const dotenv = require('dotenv');
dotenv.config();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const DonorRoutes = require('./routes/DonorRoutes');
app.use('/api/donors', DonorRoutes);
const AdminRoutes = require('./routes/AdminRoutes');
app.use('/api/admins', AdminRoutes);
const HospitalRoutes = require('./routes/HospitalRoutes');
app.use('/api/hospitals', HospitalRoutes);

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
module.exports = app;