const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
    {
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
        },
        brandName: {
            type: String,
            required: [true, "Brand name is required"],
            trim: true,
        },
        topDeals: {
            type: Boolean,
            default: false,
        },
        discount: {
            type: Number,
            min: [0, "Discount cannot be negative"],
            max: [100, "Discount cannot exceed 100"],
            required: [true, "Discount is required"],
        },
        price: {
            type: Number,
            min: [0, "Price must be a positive number"],
            required: [true, "Price is required"],
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Unisex"],
            required: [true, "Gender is required"],
        },
        typeOfWatch: {
            type: String,
            // Assuming the select options are not strict enum for this field
            required: [true, "Type of watch is required"],
            trim: true,
        },
        availability: {
            type: String,
            enum: ["In Stock", "Out of Stock"],
            required: [true, "Availability is required"],
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
        },
        imageUrl: {
            type: String,
            required: [true, "Image URL is required"],
            validate: {
                validator: function (url) {
                    // allow .jpg/.png/.webp/.gif with optional query params
                    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url);
                },
                message: "Invalid image URL format",
            },
        },
        
        // ===================================
        // ✅ NEW FIELDS ADDED TO THE SCHEMA
        // ===================================
        dialShape: {
            type: String,
            enum: ['Round', 'Square', 'Rectangular'],
            default: null, // Allows the value to be null
            required: false, // Explicitly not required
        },
        dialColor: {
            type: String,
            trim: true,
            required: false,
        },
        strapMaterial: {
            type: String,
            enum: ['Leather', 'Metal', 'Resin', 'Nylon'],
            default: null,
            required: false,
        },
        strapColor: {
            type: String,
            trim: true,
            required: false,
        },
        caseSize: {
            type: String,
            enum: ['38mm', '40mm', '42mm', '44mm'],
            default: null,
            required: false,
        },
        caseMaterial: {
            type: String,
            enum: ['Stainless Steel', 'Titanium', 'Gold-Plated', 'Ceramic', 'Plastic/Resin'],
            default: null,
            required: false,
        },
        specialEdition: {
            type: String,
            enum: ['Limited Edition', 'Signature Series', 'Vintage Collection'],
            default: null,
            required: false,
        },
        discountRange: {
            type: String,
            enum: ['10-20%', '20-30%', '30-40%', '40%+'],
            default: null,
            required: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model("Product", ProductSchema);


