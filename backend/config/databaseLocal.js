const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedDefaultData = require('./seedData');
require('dotenv').config();

let mongodServer = null;

const connectDBLocal = async () => {
  const mongoURI = process.env.MONGODB_URI || "mongodb+srv://naidubugata88:Ke33d5p7i4dUwP57@cluster0.gmfkqag.mongodb.net/careernest?retryWrites=true&w=majority&appName=Cluster0";
  
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ MongoDB connected successfully');
    console.log(`📦 Database: ${mongoose.connection.name}`);
    await seedDefaultData();
  } catch (error) {
    console.warn('⚠️ Primary MongoDB connection failed:', error.message);
    console.log('⚡ Starting local MongoMemoryServer fallback...');
    try {
      mongodServer = await MongoMemoryServer.create();
      const uri = mongodServer.getUri();
      await mongoose.connect(uri);
      console.log('✅ Connected to local MongoMemoryServer fallback at:', uri);
      await seedDefaultData();
    } catch (memErr) {
      console.error('❌ Failed to start MongoMemoryServer fallback:', memErr.message);
      process.exit(1);
    }
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('🔗 Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Mongoose disconnected');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  if (mongodServer) {
    await mongodServer.stop();
  }
  console.log('🛑 MongoDB connection closed through app termination');
  process.exit(0);
});

module.exports = connectDBLocal;
