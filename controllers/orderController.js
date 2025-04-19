const Order = require("../models/Order");
const Customer = require("../models/Customer");
const Address = require("../models/Address");
const { find } = require("../models/Product");

const addOrder = async (req, res) => {
  const customerId = req.params.customerid;
  const {
    address, // ObjectId of selected address
    items, // Array of products with quantity
    totalAmount,
    paymentMethod,
    paymentStatus,
    orderStatus,
  } = req.body;

  try {
    const existedCustomer = await Customer.findById(customerId);
    if (!existedCustomer) {
      return res.status(400).json({ message: "customer not exist" });
    }
    const existingAddress = await Address.findById(address);
    if (!existingAddress) {
      return res.status(400).json({ message: "address not exist" });
    }
    const newOrder = new Order({
      orderedAt: Date.now(),
      customer: customerId,
      address,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus,
    });

    const savedOrder = await newOrder.save();
    existedCustomer.orders.push(savedOrder._id);
    await existedCustomer.save();
    res
      .status(201)
      .json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Failed to place order", error: error.message });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find();
    if (!allOrders || allOrders.length === 0) {
      return res
        .status(200)
        .json({ message: "No orders placed yet", allOrders: [] });
    }
    return res
      .status(200)
      .json({ message: "orders fetch successfully", allOrders });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

const getAllOrdersByCustomerId = async (req, res) => {
  const customerId = req.params.customerid;
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(400).json({ message: "customer not exist" });
    }
    const customerOrders = await Order.find({ customer: customerId });

    if (!customerOrders || customerOrders.length === 0) {
      return res.status(200).json({
        message: "No orders found for this customer",
        orders: [],
      });
    }

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders: customerOrders,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "internal server error", error: error.message });
  }
};

const cancelOrderByCustomer = async (req, res) => {
  const { orderId, customerId } = req.params;

  try {
    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if the order exists and belongs to the customer
    const order = await Order.findOne({ _id: orderId, customer: customerId });

    if (!order) {
      return res
        .status(404)
        .json({ message: "Order not found for this customer" });
    }

    // Check if order is already delivered or cancelled
    if (order.orderStatus === "Delivered") {
      return res
        .status(400)
        .json({ message: "Delivered orders cannot be cancelled" });
    }

    if (order.orderStatus === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" });
    }

    // Update order status to cancelled
    order.orderStatus = "Cancelled";
    order.paymentStatus = "Refund Initiated"; // Optional
    await order.save();

    return res
      .status(200)
      .json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateOrderStatusByVendor = async (req, res) => {
  const { orderId } = req.params;
  const { orderStatus } = req.body;

  const allowedStatuses = [
    "Placed",
    "Shipped",
    "OutForDelivery",
    "Delivered",
    "Cancelled",
  ];

  try {
    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        message: `Invalid status. Allowed values are: ${allowedStatuses.join(
          ", "
        )}`,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const getOrdersByCustomerForVendor = async (req, res) => {
  //const vendorId = req.params.vendorid;  // Get vendor ID from the request params

  try {
    // Fetch orders for the vendor
    //const orders = await Order.find({ vendor: vendorId })
    const orders = await Order.find()
      .populate("customer") // Populate the customer details (optional)
      .exec();

    if (!orders || orders.length === 0) {
      return res
        .status(404)
        .json({ message: "No orders found for this vendor" });
    }

    // Group orders by customer
    const ordersGroupedByCustomer = orders.reduce((acc, order) => {
      const customerId = order.customer._id.toString(); // Get customerId

      if (!acc[customerId]) {
        acc[customerId] = {
          customer: order.customer, // Store customer info
          orders: [],
        };
      }

      acc[customerId].orders.push(order);
      return acc;
    }, {});

    return res.status(200).json({
      message: "Orders fetched successfully",
      ordersGroupedByCustomer,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = {
  getOrdersByCustomerForVendor,
};

module.exports = {
  addOrder,
  getAllOrders,
  getAllOrdersByCustomerId,
  cancelOrderByCustomer,
  updateOrderStatusByVendor,
  getOrdersByCustomerForVendor,
};