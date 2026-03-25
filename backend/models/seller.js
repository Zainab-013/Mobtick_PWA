const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String, // manually entered
});

module.exports = mongoose.model("Seller", sellerSchema);
