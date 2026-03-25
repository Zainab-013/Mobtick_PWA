const express = require("express");
const router = express.Router();
const Product = require("../models/product");

// --- Helper to escape regex ---
function escapeRegex(text = "") {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// --- CREATE PRODUCT ---
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, msg: "Product added successfully!", product });
  } catch (error) {
    let msg = "Error adding product.";
    if (error.name === "ValidationError") {
      msg = Object.values(error.errors).map((val) => val.message).join(", ");
    }
    res.status(400).json({ success: false, msg });
  }
});


// ======================================================
// ✅ KEEP CATEGORY ROUTES ABOVE THE DYNAMIC ONES
// ======================================================
// ---GET UNISEX PRODUCTS ---
router.get("/unisex", async (req, res) => {
  try {
    const {
      brand,
      style,
      dialShape,
      dialColor,
      strapMaterial,
      strapColor,
      caseSize,
      caseMaterial,
      specialEdition,
      minDiscount,
      maxDiscount,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = { gender: "Unisex" };

    // Text / enum filters
    if (brand) filter.brandName = { $regex: escapeRegex(brand.trim()), $options: "i" };
    if (style) filter.typeOfWatch = { $regex: escapeRegex(style.trim()), $options: "i" };
    if (dialShape) filter.dialShape = { $regex: escapeRegex(dialShape.trim()), $options: "i" };
    if (dialColor) filter.dialColor = { $regex: escapeRegex(dialColor.trim()), $options: "i" };
    if (strapMaterial) filter.strapMaterial = { $regex: escapeRegex(strapMaterial.trim()), $options: "i" };
    if (strapColor) filter.strapColor = { $regex: escapeRegex(strapColor.trim()), $options: "i" };
    if (caseSize) filter.caseSize = { $regex: escapeRegex(caseSize.trim()), $options: "i" };
    if (caseMaterial) filter.caseMaterial = { $regex: escapeRegex(caseMaterial.trim()), $options: "i" };
    if (specialEdition) filter.specialEdition = { $regex: escapeRegex(specialEdition.trim()), $options: "i" };

    // ✅ Price filter
    if (minPrice && maxPrice) filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    else if (minPrice) filter.price = { $gte: Number(minPrice) };
    else if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    // ✅ Discount filter
    if (minDiscount && maxDiscount) filter.discount = { $gte: Number(minDiscount), $lte: Number(maxDiscount) };
    else if (minDiscount) filter.discount = { $gte: Number(minDiscount) };
    else if (maxDiscount) filter.discount = { $lte: Number(maxDiscount) };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("GET /api/products/unisex error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});
// --- GET MEN PRODUCTS ---
router.get("/men", async (req, res) => {
  try {
    const {
      brand,
      style,
      dialShape,
      dialColor,
      strapMaterial,
      strapColor,
      caseSize,
      caseMaterial,
      specialEdition,
      minDiscount,
      maxDiscount,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = { gender: "Male" };

    // Text / enum filters
    if (brand) filter.brandName = { $regex: escapeRegex(brand.trim()), $options: "i" };
    if (style) filter.typeOfWatch = { $regex: escapeRegex(style.trim()), $options: "i" };
    if (dialShape) filter.dialShape = { $regex: escapeRegex(dialShape.trim()), $options: "i" };
    if (dialColor) filter.dialColor = { $regex: escapeRegex(dialColor.trim()), $options: "i" };
    if (strapMaterial) filter.strapMaterial = { $regex: escapeRegex(strapMaterial.trim()), $options: "i" };
    if (strapColor) filter.strapColor = { $regex: escapeRegex(strapColor.trim()), $options: "i" };
    if (caseSize) filter.caseSize = { $regex: escapeRegex(caseSize.trim()), $options: "i" };
    if (caseMaterial) filter.caseMaterial = { $regex: escapeRegex(caseMaterial.trim()), $options: "i" };
    if (specialEdition) filter.specialEdition = { $regex: escapeRegex(specialEdition.trim()), $options: "i" };

    // ✅ Price filter
    if (minPrice && maxPrice) filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    else if (minPrice) filter.price = { $gte: Number(minPrice) };
    else if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    // ✅ Discount filter
    if (minDiscount && maxDiscount) filter.discount = { $gte: Number(minDiscount), $lte: Number(maxDiscount) };
    else if (minDiscount) filter.discount = { $gte: Number(minDiscount) };
    else if (maxDiscount) filter.discount = { $lte: Number(maxDiscount) };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("GET /api/products/men error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});


// --- GET WOMEN PRODUCTS ---
router.get("/women", async (req, res) => {
  try {
    const {
      brand,
      style,
      dialShape,
      dialColor,
      strapMaterial,
      strapColor,
      caseSize,
      caseMaterial,
      specialEdition,
      minDiscount,
      maxDiscount,
      minPrice,
      maxPrice,
    } = req.query;

    const filter = { gender: "Female" };

    // Text / enum filters
    if (brand) filter.brandName = { $regex: escapeRegex(brand.trim()), $options: "i" };
    if (style) filter.typeOfWatch = { $regex: escapeRegex(style.trim()), $options: "i" };
    if (dialShape) filter.dialShape = { $regex: escapeRegex(dialShape.trim()), $options: "i" };
    if (dialColor) filter.dialColor = { $regex: escapeRegex(dialColor.trim()), $options: "i" };
    if (strapMaterial) filter.strapMaterial = { $regex: escapeRegex(strapMaterial.trim()), $options: "i" };
    if (strapColor) filter.strapColor = { $regex: escapeRegex(strapColor.trim()), $options: "i" };
    if (caseSize) filter.caseSize = { $regex: escapeRegex(caseSize.trim()), $options: "i" };
    if (caseMaterial) filter.caseMaterial = { $regex: escapeRegex(caseMaterial.trim()), $options: "i" };
    if (specialEdition) filter.specialEdition = { $regex: escapeRegex(specialEdition.trim()), $options: "i" };

    // ✅ Price filter
    if (minPrice && maxPrice) filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) };
    else if (minPrice) filter.price = { $gte: Number(minPrice) };
    else if (maxPrice) filter.price = { $lte: Number(maxPrice) };

    // ✅ Discount filter
    if (minDiscount && maxDiscount) filter.discount = { $gte: Number(minDiscount), $lte: Number(maxDiscount) };
    else if (minDiscount) filter.discount = { $gte: Number(minDiscount) };
    else if (maxDiscount) filter.discount = { $lte: Number(maxDiscount) };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("GET /api/products/women error:", err);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});


// ======================================================
// 🚀 Dynamic routes BELOW
// ======================================================

// --- GET SINGLE PRODUCT ---
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, msg: "Product not found." });
    res.status(200).json({ success: true, product });
  } catch (error) {
    if (error.name === "CastError")
      return res.status(400).json({ success: false, msg: "Invalid Product ID." });
    res.status(500).json({ success: false, msg: "Error fetching product.", error: error.message });
  }
});

// --- GET ALL PRODUCTS ---
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error fetching products.", error: error.message });
  }
});

// --- UPDATE PRODUCT ---
router.put("/:id", async (req, res) => {
  const updateData = { ...req.body };

  if (updateData.startDate) {
    let date = new Date(updateData.startDate);
    date.setUTCHours(0, 0, 0, 0);
    updateData.startDate = date;
  }
  if (updateData.endDate) {
    let date = new Date(updateData.endDate);
    date.setUTCHours(0, 0, 0, 0);
    updateData.endDate = date;
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct)
      return res.status(404).json({ success: false, msg: "Product not found." });
    res.status(200).json({ success: true, msg: "Product updated successfully.", product: updatedProduct });
  } catch (error) {
    let msg = "Error updating product.";
    if (error.name === "ValidationError")
      msg = Object.values(error.errors).map((v) => v.message).join(", ");
    res.status(400).json({ success: false, msg });
  }
});

// --- DELETE PRODUCT ---
router.delete("/:id", async (req, res) => {
  try {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ success: false, msg: "Product not found." });
    res.status(200).json({ success: true, msg: "Product deleted successfully." });
  } catch (error) {
    res.status(500).json({ success: false, msg: "Error deleting product.", error: error.message });
  }
});

module.exports = router;
