// models/Order.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  id: String,
  name: String,
  image: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema({
  customer: {
    name: { type: String, required: true },
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    pincode: String,
  },
  items: [ItemSchema],
  brand: String,
  watchType: String,
  quantity: Number,         // convenient aggregate
  pricePerItem: Number,
  totalAmount: { type: Number, required: true },
  paymentMode: { type: String, enum: ["cod", "online"], required: true },
  paymentIntentId: String,   // stripe paymentIntent id (for online)
  paymentStatus: { type: String, default: "pending" }, // pending / succeeded / failed
  orderDate: { type: Date, default: Date.now },
  meta: { type: mongoose.Schema.Types.Mixed }, // any extra payload
}, { timestamps: true });

module.exports = mongoose.model("order", orderSchema);
