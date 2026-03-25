require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// routes
const authRoutes = require("./routes/auth");
const trendingRoutes = require("./routes/trendingProduct");
const productRoutes = require("./routes/productRoutes");
const reviewRoute = require("./routes/reviewRoute");
const paymentRoutes = require("./routes/payment");
const ordersRouter = require("./routes/order");

const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const app = express();

// ✅ CORS setup (allow frontend access)
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// ✅ Stripe webhook raw parser
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("⚠️  Webhook signature verification failed.", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        console.log("✅ Payment succeeded:", paymentIntent.id);
      } else if (event.type === "payment_intent.payment_failed") {
        const pi = event.data.object;
        console.log("❌ Payment failed:", pi.id);
      }
    } catch (err) {
      console.error("Error handling webhook event:", err);
    }

    res.json({ received: true });
  }
);

// ✅ JSON parser for all normal routes
app.use(express.json());

// ✅ Connect to MongoDB (with error handling)
connectDB()
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/trending", trendingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoute);
app.use("/api", paymentRoutes);
app.use("/api/order", ordersRouter);

// ✅ Root route for testing
app.get("/", (req, res) => {
  res.send("🚀 Mobtick Backend is running successfully!");
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
