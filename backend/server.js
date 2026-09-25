// Entry point of the app
// - Load environment variables (dotenv)
// - Connect to MongoDB (call connectDB from src/config/db.js)
// - Import app from src/app.js
// - Start the server with app.listen(PORT)
require('dotenv').config();
const connectDB = require('./src/config/db');
const app = require('./src/app');

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});