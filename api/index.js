const app = require('../backend/src/app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

let mongoConnected = false;

// This must be the FIRST middleware
const originalListen = app.listen.bind(app);

async function connectDB() {
  if (!mongoConnected && process.env.MONGO_URI) {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      });
      mongoConnected = true;
    }
  }
}

// Wrap the handler for Vercel
module.exports = async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    return res.status(500).json({ error: 'Database connection failed' });
  }
  app(req, res);
};
