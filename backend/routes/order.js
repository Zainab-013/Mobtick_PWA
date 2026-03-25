// routes/order.js

const express = require("express");
const router = express.Router();
const Order = require("../models/order");

// ============================================
// POST / - Create order
// ============================================
router.post("/", async (req, res) => {
  try {
    const {
      customer,
      items,
      brand,
      watchType,
      quantity,
      pricePerItem,
      totalAmount,
      paymentMode,
      paymentIntentId,
      paymentStatus,
      meta,
    } = req.body;

    // Basic validation
    if (!customer?.name || !totalAmount || !paymentMode) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Ensure quantity and pricePerItem are set properly
    const orderQuantity = quantity || (items ? items.reduce((sum, item) => sum + item.quantity, 0) : 1);
    const orderPricePerItem = pricePerItem || (items && items.length > 0 ? items[0].price : 0);

    const order = new Order({
      customer,
      items,
      brand,
      watchType,
      quantity: orderQuantity,
      pricePerItem: orderPricePerItem,
      totalAmount,
      paymentMode,
      paymentIntentId: paymentIntentId || null,
      paymentStatus: paymentStatus || (paymentMode === "cod" ? "pending" : "succeeded"),
      meta,
    });

    await order.save();
    console.log("✅ Order created:", order._id);
    return res.status(201).json({ ok: true, orderId: order._id });
  } catch (err) {
    console.error("❌ Order create error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

// ============================================
// GET /customers - Fetch all customers/orders
// ============================================
router.get("/customers", async (req, res) => {
  try {
    console.log("📊 Fetching customers...");
    
    // Fetch all orders, sorted by most recent first
    const orders = await Order.find()
      .sort({ orderDate: -1 })
      .lean();

    console.log(`✅ Found ${orders.length} orders`);

    // Transform data to match ViewCustomer component expectations
    const transformedOrders = orders.map(order => {
      // Build full address string
      const addressParts = [
        order.customer?.address,
        order.customer?.city,
        order.customer?.state,
        order.customer?.pincode
      ].filter(Boolean);
      
      const fullAddress = addressParts.join(", ") || "N/A";

      // Determine delivery status based on payment status
      let deliveryStatus = "Processing";
      if (order.paymentStatus === "succeeded") {
        deliveryStatus = "Delivered";
      } else if (order.paymentStatus === "pending") {
        deliveryStatus = "Processing";
      } else if (order.paymentStatus === "failed") {
        deliveryStatus = "Cancelled";
      }

      return {
        _id: order._id,
        customerName: order.customer?.name || "N/A",
        email: order.customer?.email || "N/A",
        phone: order.customer?.phone || "N/A",
        address: fullAddress,
        brandName: order.brand || (order.items && order.items[0]?.name) || "N/A",
        watchType: order.watchType || (order.items && order.items[0]?.name) || "N/A",
        quantityPurchased: order.quantity || 0,
        orderDate: order.orderDate || order.createdAt,
        deliveryStatus: deliveryStatus,
        totalAmount: order.totalAmount || 0,
        paymentMode: order.paymentMode,
        paymentStatus: order.paymentStatus,
        items: order.items || []
      };
    });

    return res.status(200).json({ 
      success: true, 
      count: transformedOrders.length,
      data: transformedOrders 
    });

  } catch (err) {
    console.error("❌ Error fetching customers:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to fetch customer data", 
      error: err.message 
    });
  }
});

// ============================================
// GET /stats - Get statistics
// ============================================
router.get("/stats", async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ paymentStatus: "pending" });
    const successfulOrders = await Order.countDocuments({ paymentStatus: "succeeded" });
    const failedOrders = await Order.countDocuments({ paymentStatus: "failed" });

    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: "succeeded" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    const pendingRevenueResult = await Order.aggregate([
      { $match: { paymentStatus: "pending" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);
    const pendingRevenue = pendingRevenueResult.length > 0 ? pendingRevenueResult[0].total : 0;

    const codOrders = await Order.countDocuments({ paymentMode: "cod" });
    const onlineOrders = await Order.countDocuments({ paymentMode: "online" });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = await Order.countDocuments({ 
      orderDate: { $gte: sevenDaysAgo } 
    });

    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      { 
        $group: { 
          _id: "$items.name", 
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        } 
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 5 }
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          orderDate: { $gte: sixMonthsAgo },
          paymentStatus: "succeeded"
        } 
      },
      {
        $group: {
          _id: {
            year: { $year: "$orderDate" },
            month: { $month: "$orderDate" }
          },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const avgOrderValue = successfulOrders > 0 ? Math.round(totalRevenue / successfulOrders) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        successfulOrders,
        pendingOrders,
        failedOrders,
        totalRevenue,
        pendingRevenue,
        codOrders,
        onlineOrders,
        recentOrders,
        avgOrderValue,
        topProducts,
        monthlyRevenue
      }
    });

  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch statistics",
      error: err.message
    });
  }
});

module.exports = router;
