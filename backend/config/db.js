const mongoose = require('mongoose');

let isMockMode = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/purplezone', {
      serverSelectionTimeoutMS: 3000 // 3 seconds timeout to fail fast and fall back
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    isMockMode = false;
  } catch (error) {
    console.warn('==================================================');
    console.warn('WARNING: Failed to connect to local MongoDB database.');
    console.warn('Switching to local In-Memory / Mock DB Fallback Mode.');
    console.warn('You can test the backend fully without MongoDB running!');
    console.warn('==================================================');
    isMockMode = true;
  }
};

const getDbMode = () => isMockMode;

module.exports = { connectDB, getDbMode };
