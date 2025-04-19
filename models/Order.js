const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    totalAmount: { type: Number, required: true },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["CashOnDelivery", "GooglePay", "PhonePe", "Paytm"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Paid", "Pending", "Refund Initiated"],
      required: true,
      default:"pending"
    },
    orderStatus: {
      type: String,
      enum: ["Placed", "Shipped", "OutForDelivery", "Delivered", "Cancelled"],
      default: "Placed",
    },
  },
  {
    timestamps: true, // ✅ This automatically adds createdAt and updatedAt fields
  }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
