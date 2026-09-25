// MongoDB connection setup
// - Import mongoose
// - Export an async function connectDB()
//     - Connect using process.env.MONGO_URI
//     - Log a success message with the connected host
//     - On failure: log the error and process.exit(1)
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB; 