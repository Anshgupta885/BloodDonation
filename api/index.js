const app = require('../backend/src/app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Track if we've already connected to MongoDB
let mongoConnected = false;

// Middleware to ensure MongoDB connection
app.use(async (req, res, next) => {
  if (!mongoConnected && process.env.MONGO_URI) {
    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGO_URI, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
        });
        console.log('MongoDB connected via serverless handler');
        mongoConnected = true;
      }
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }
  next();
});

// Export the Express app for Vercel
module.exports = app;
