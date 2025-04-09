const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String, // Can be a URL or file path
  },
  packOf: {
    type: String, // e.g., "1 piece", "Pack of 2", "Set of 5"
    required: true,
  },
  category: {
    type: [
      {
        type: String,
        enum: [
          "Accessories",
          "Rangoli & Decoration",
          "Clothing",
          "Toys",
          "Festive & Pooja Essentials",
          "Traditional Items",
          "Tailoring & Dress Materials",
        ],
      },
    ],
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
