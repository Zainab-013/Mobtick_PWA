const express = require("express");
const Review = require("../models/review");
const router = express.Router();

// ✅ GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// ✅ GET top N reviews by rating (then newest)
router.get("/top", async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit, 10) || 3);
    const top = await Review.find()
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit)
      .lean();
    res.json(top);
  } catch (err) {
    res.status(500).json({ message: "Error fetching top reviews" });
  }
});

// ✅ POST a new review
router.post("/", async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    if (!name || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const review = new Review({ name, rating, comment });
    await review.save();

    res.status(201).json({ review });
  } catch (err) {
    res.status(500).json({ message: "Error saving review" });
  }
});

module.exports = router;
