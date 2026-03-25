// backend/routes/payment.js
const express = require("express");
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
const { verifyToken } = require("../middleware/auth");

router.post("/create-payment-intent", verifyToken, async (req, res) => {
  const { amount } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects lowest currency unit
      currency: "inr",
      payment_method_types: ["card"],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
