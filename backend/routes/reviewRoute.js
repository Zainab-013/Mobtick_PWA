const express = require("express");
const Review = require("../models/review");
const { verifyToken } = require("../middleware/auth");
const router = express.Router();

// GET all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// GET top N reviews by rating (then newest)
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

// POST a new review (with rating validation)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, rating, comment, productId } = req.body;
    if (!name || rating == null || !comment) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const review = new Review({ name, rating: numRating, comment, productId: productId || null });
    await review.save();

    res.status(201).json({ review });
  } catch (err) {
    if (err.name === "ValidationError") {
      const msg = Object.values(err.errors).map((e) => e.message).join(", ");
      return res.status(400).json({ message: msg });
    }
    res.status(500).json({ message: "Error saving review" });
  }
});

module.exports = router;
