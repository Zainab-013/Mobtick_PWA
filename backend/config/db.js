const mongoose = require("mongoose");

// MongoDB connection URI
const MONGO_URI = "mongodb+srv://mobtick:mobtick123@zainab-013.tcc3acr.mongodb.net/mobtick?retryWrites=true&w=majority&appName=zainab-013"; 
// 👆 Replace `ecommerceDB` with your DB name

// Function to connect
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // stop server if DB fails
  }
};

module.exports = connectDB;
