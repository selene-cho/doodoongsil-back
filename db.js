const mongoose = require('mongoose');

async function connectMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Successfully connected MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}

module.exports = connectMongoDB;
