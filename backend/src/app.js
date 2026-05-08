const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app=express();

const dotenv = require('dotenv');
dotenv.config();

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
    origin: allowedOrigins,
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
const RequesterRoutes = require('./routes/RequesterRoutes');
app.use('/api/requesters', RequesterRoutes);
const RequestRoutes = require('./routes/RequestRoutes');
app.use('/api', RequestRoutes);
const AuthRoutes = require('./routes/AuthRoutes');
app.use('/api/auth', AuthRoutes);

// New routes for certificates and analytics
const CertificateRoutes = require('./routes/CertificateRoutes');
app.use('/api/certificates', CertificateRoutes);
const AnalyticsRoutes = require('./routes/AnalyticsRoutes');
app.use('/api/analytics', AnalyticsRoutes);

// Sample route
app.get('/', (req, res) => {
    res.send('Hello World!');
});
module.exports = app;