const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// Get all products (with optional filters)
router.get("/products", async (req, res) => {
  try {
    const { topDeals } = req.query;

    let filter = {};

    // agar query param diya hai toh uske basis pe filter
    if (topDeals === "true") {
      filter.topDeals = true;
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No products found",
        products: [],
      });
    }

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      msg: "Failed to fetch products",
      error: error.message,
    });
  }
});

module.exports = router;
