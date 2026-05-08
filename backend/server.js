const app = require('./src/app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

// Only try to listen if running directly (not when imported as a module)
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected');
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on http://localhost:${process.env.PORT || 5000}`);
        });
    })
    .catch(err => {
        console.log('Failed to connect to MongoDB', err);
    });
}

module.exports = app;

